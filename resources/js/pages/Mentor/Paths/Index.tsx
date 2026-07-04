import AppLayout from '@/layouts/app-layout';
import { useForm, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import {
    Map,
    Plus,
    Edit,
    Trash2,
    ClipboardList,
    Layers,
    ArrowLeft,
    GripVertical,
    X,
    Check,
    AlertTriangle,
} from 'lucide-react';
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Path {
    id: string;
    name: string;
    description?: string;
    order: number;
}

interface Group {
    id: string;
    name: string;
    status?: 'draft' | 'completed';
}

interface Props {
    group: Group;
    paths: Path[];
    basic_paths?: Path[];
}

/* ================= SORTABLE PATH CARD ================= */
interface SortablePathCardProps {
    path: Path;
    index: number;
    group: Group;
    onEdit: (path: Path) => void;
    onDelete: (path: Path) => void;
    isFundamental?: boolean;
}

function SortablePathCard({
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
                className={`absolute top-0 left-0 h-full w-[3px] transition-opacity ${isFundamental ? 'bg-indigo-500' : 'bg-slate-400 dark:bg-slate-500'} opacity-0 group-hover:opacity-100`}
            ></div>

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
                    <h3 className="text-slate-850 text-sm leading-snug font-bold transition-colors group-hover:text-indigo-600 sm:text-base dark:text-slate-100 dark:group-hover:text-indigo-400">
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
                    href={`/mentor/career-groups/${group.id}/paths/${path.id}/modules`}
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

/* ================= MAIN COMPONENT ================= */
export default function Index({ group, paths, basic_paths = [] }: Props) {
    const handleToggleStatus = () => {
        const nextStatus = group.status === 'completed' ? 'draft' : 'completed';
        router.post(
            `/mentor/career-groups/${group.id}/status`,
            {
                status: nextStatus,
            },
            {
                preserveScroll: true,
            },
        );
    };

    const [basicList, setBasicList] = useState<Path[]>(basic_paths);
    const [careerList, setCareerList] = useState<Path[]>(paths);

    const [createModalPhase, setCreateModalPhase] = useState<
        'basic_fundamental' | 'career_branch' | null
    >(null);
    const [editingPath, setEditingPath] = useState<Path | null>(null);
    const [deletingPath, setDeletingPath] = useState<Path | null>(null);

    // Sync state when props change
    useEffect(() => {
        setBasicList(basic_paths);
    }, [basic_paths]);

    useEffect(() => {
        setCareerList(paths);
    }, [paths]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 5 },
        }),
    );

    // Creation Form
    const createForm = useForm({
        name: '',
        description: '',
        phase: 'career_branch',
    });

    // Editing Form
    const editForm = useForm({
        name: '',
        description: '',
    });

    const openCreateModal = (phase: 'basic_fundamental' | 'career_branch') => {
        createForm.reset();
        createForm.setData({
            name: '',
            description: '',
            phase: phase,
        });
        setCreateModalPhase(phase);
    };

    const handleCreatePath = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post(`/mentor/career-groups/${group.id}/paths`, {
            preserveScroll: true,
            onSuccess: () => {
                setCreateModalPhase(null);
                createForm.reset();
            },
        });
    };

    const openEditModal = (path: Path) => {
        editForm.setData({
            name: path.name,
            description: path.description || '',
        });
        setEditingPath(path);
    };

    const handleEditPath = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingPath) return;

        editForm.put(`/mentor/paths/${editingPath.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setEditingPath(null);
                editForm.reset();
            },
        });
    };

    const handleDeletePath = () => {
        if (!deletingPath) return;

        router.delete(`/mentor/paths/${deletingPath.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setDeletingPath(null);
            },
        });
    };

    const handleBasicDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = basicList.findIndex((p) => p.id === active.id);
        const newIndex = basicList.findIndex((p) => p.id === over.id);

        if (oldIndex === -1 || newIndex === -1) return;

        const newItems = [...basicList];
        const [movedItem] = newItems.splice(oldIndex, 1);
        newItems.splice(newIndex, 0, movedItem);
        setBasicList(newItems);

        router.put(
            '/mentor/paths/reorder',
            {
                paths: newItems.map((item, i) => ({
                    id: item.id,
                    order: i + 1,
                })),
            },
            {
                preserveScroll: true,
            },
        );
    };

    const handleCareerDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = careerList.findIndex((p) => p.id === active.id);
        const newIndex = careerList.findIndex((p) => p.id === over.id);

        if (oldIndex === -1 || newIndex === -1) return;

        const newItems = [...careerList];
        const [movedItem] = newItems.splice(oldIndex, 1);
        newItems.splice(newIndex, 0, movedItem);
        setCareerList(newItems);

        router.put(
            '/mentor/paths/reorder',
            {
                paths: newItems.map((item, i) => ({
                    id: item.id,
                    order: i + 1,
                })),
            },
            {
                preserveScroll: true,
            },
        );
    };

    return (
        <AppLayout>
            <div
                className="mx-auto w-full space-y-8 p-4 sm:p-6 lg:p-8"
                style={{ fontFamily: "'Outfit', sans-serif" }}
            >
                {/* Header Section */}
                <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-3 sm:items-center sm:gap-4">
                        <Link
                            href={`/mentor/dashboard`}
                            className="shrink-0 rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 shadow-sm transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <div className="min-w-0">
                            <h1 className="text-xl font-bold tracking-tight text-slate-800 sm:text-2xl dark:text-white">
                                Atur Learning Paths
                            </h1>
                            <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                Branch Karir:{' '}
                                <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                                    {group.name}
                                </span>
                                {group.status === 'completed' ? (
                                    <span className="inline-flex items-center gap-1 rounded border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-emerald-600 uppercase dark:text-emerald-400">
                                        <Check className="h-3 w-3" />
                                        Selesai
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 rounded border border-amber-500/20 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-amber-600 uppercase dark:text-amber-400">
                                        <AlertTriangle className="h-3 w-3 animate-pulse" />
                                        Dalam Penginputan
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <button
                            onClick={handleToggleStatus}
                            className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:border-slate-400 hover:text-slate-900 active:scale-95 sm:w-auto dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-slate-500 dark:hover:text-white"
                        >
                            {group.status === 'completed' ? (
                                <>
                                    <X className="h-4 w-4" />
                                    <span>Kembalikan ke Draft</span>
                                </>
                            ) : (
                                <>
                                    <Check className="h-4 w-4" />
                                    <span>Tandai Selesai Input</span>
                                </>
                            )}
                        </button>

                        <Link
                            href={`/mentor/career-groups/${group.id}/submissions`}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:border-slate-400 hover:text-slate-900 active:scale-95 sm:w-auto dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-slate-500 dark:hover:text-white"
                        >
                            <ClipboardList className="h-4 w-4" />
                            <span>Kelola Submission Siswa</span>
                        </Link>
                    </div>
                </div>

                {/* TWO-COLUMN GRID */}
                <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-12">
                    {/* ================= LEFT COLUMN: Basic Fundamentals ================= */}
                    <div className="lg:col-span-6">
                        <div className="font-outfit relative flex min-h-[400px] flex-col overflow-hidden rounded-2xl border border-slate-200/80 shadow-sm shadow-slate-100/50 dark:border-slate-800">
                            <div className="absolute inset-0 bg-white dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]" />
                            <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700" />

                            {/* Card Header */}
                            <div className="relative z-10 flex items-center justify-between gap-4 border-b border-slate-200 p-6 dark:border-slate-800/60">
                                <div className="flex items-center gap-3">
                                    <div>
                                        <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800 dark:text-white">
                                            Basic Fundamentals
                                        </h2>
                                        <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
                                            Materi dasar bersama yang diedit
                                            kolaboratif oleh seluruh mentor.
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        openCreateModal('basic_fundamental')
                                    }
                                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-bold text-white shadow-md shadow-indigo-500/10 transition-all hover:bg-indigo-700 active:scale-95"
                                >
                                    <Plus className="h-3.5 w-3.5" />
                                    <span>Tambah Path</span>
                                </button>
                            </div>

                            {/* Paths List */}
                            <div className="relative z-10 flex min-h-0 flex-1 flex-col p-6">
                                {basicList.length === 0 ? (
                                    <div className="flex min-h-[250px] flex-1 flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-6 text-center dark:border-slate-800 dark:bg-slate-800/20">
                                        <Layers className="mb-3 h-12 w-12 text-slate-300 dark:text-slate-700" />
                                        <p className="max-w-xs text-sm text-slate-500 dark:text-slate-400">
                                            Tidak ada materi Basic Fundamental
                                            yang tersedia. Silakan klik Tambah
                                            Path untuk membuatnya.
                                        </p>
                                    </div>
                                ) : (
                                    <DndContext
                                        sensors={sensors}
                                        collisionDetection={closestCenter}
                                        onDragEnd={handleBasicDragEnd}
                                    >
                                        <SortableContext
                                            items={basicList.map((p) => p.id)}
                                            strategy={
                                                verticalListSortingStrategy
                                            }
                                        >
                                            <div className="space-y-4">
                                                {basicList.map((path, idx) => (
                                                    <SortablePathCard
                                                        key={path.id}
                                                        path={path}
                                                        index={idx}
                                                        group={group}
                                                        isFundamental={true}
                                                        onEdit={openEditModal}
                                                        onDelete={
                                                            setDeletingPath
                                                        }
                                                    />
                                                ))}
                                            </div>
                                        </SortableContext>
                                    </DndContext>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ================= RIGHT COLUMN: Learning Progression ================= */}
                    <div className="lg:col-span-6">
                        <div className="font-outfit relative flex min-h-[400px] flex-col overflow-hidden rounded-2xl border border-slate-200/80 shadow-sm shadow-slate-100/50 dark:border-slate-800">
                            <div className="absolute inset-0 bg-white dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]" />
                            <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700" />

                            {/* Card Header */}
                            <div className="relative z-10 flex flex-col gap-4 border-b border-slate-200 p-6 dark:border-slate-800/60 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-start gap-3">
                                    <div className="min-w-0">
                                        <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800 dark:text-white">
                                            Career Branch
                                        </h2>
                                        <p className="text-slate-450 mt-1 text-[11px] dark:text-slate-500">
                                            Kurikulum berjenjang spesifik untuk branch karir ini.
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => openCreateModal('career_branch')}
                                    className="inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-sm transition-colors hover:border-slate-400 hover:text-slate-900 active:scale-95 sm:w-auto dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-slate-500 dark:hover:text-white"
                                >
                                    <Plus className="h-3.5 w-3.5" />
                                    <span>Tambah Path</span>
                                </button>
                            </div>

                            {/* Paths List */}
                            <div className="relative z-10 flex min-h-0 flex-1 flex-col p-6">
                                {careerList.length === 0 ? (
                                    <div className="flex min-h-[250px] flex-1 flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-6 text-center dark:border-slate-800 dark:bg-slate-800/20">
                                        <Map className="mb-3 h-12 w-12 text-slate-300 dark:text-slate-700" />
                                        <p className="max-w-xs text-sm text-slate-500 dark:text-slate-400">
                                            Belum ada learning path untuk branch karir ini. Silakan klik Tambah Path untuk membuatnya.
                                        </p>
                                    </div>
                                ) : (
                                    <DndContext
                                        sensors={sensors}
                                        collisionDetection={closestCenter}
                                        onDragEnd={handleCareerDragEnd}
                                    >
                                        <SortableContext
                                            items={careerList.map((p) => p.id)}
                                            strategy={verticalListSortingStrategy}
                                        >
                                            <div className="space-y-4">
                                                {careerList.map((path, idx) => (
                                                    <SortablePathCard
                                                        key={path.id}
                                                        path={path}
                                                        index={idx}
                                                        group={group}
                                                        isFundamental={false}
                                                        onEdit={openEditModal}
                                                        onDelete={setDeletingPath}
                                                    />
                                                ))}
                                            </div>
                                        </SortableContext>
                                    </DndContext>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ================= MODAL: CREATE PATH ================= */}
                {createModalPhase && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs transition-opacity duration-300">
                        <div className="relative w-full max-w-md animate-in rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl duration-200 zoom-in-95 fade-in dark:border-slate-800 dark:bg-slate-950">
                            {/* Close button */}
                            <button
                                type="button"
                                onClick={() => setCreateModalPhase(null)}
                                className="absolute top-4 right-4 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-900 dark:hover:text-slate-200"
                            >
                                <X className="h-5 w-5" />
                            </button>

                            <div className="mb-5 flex items-center gap-3">
                                <div
                                    className={`rounded-xl border p-2.5 ${createModalPhase === 'basic_fundamental' ? 'border-indigo-200 bg-indigo-50 text-indigo-600 dark:border-indigo-900 dark:bg-indigo-950/60 dark:text-indigo-400' : 'border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400'}`}
                                >
                                    <Plus className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                                        Tambah Path Baru
                                    </h3>
                                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                                        {createModalPhase ===
                                        'basic_fundamental'
                                            ? 'Membuat materi Basic Fundamental (Course Utama)'
                                            : 'Membuat materi Progression (Career Branch)'}
                                    </p>
                                </div>
                            </div>

                            <form
                                onSubmit={handleCreatePath}
                                className="space-y-4"
                            >
                                <div>
                                    <label className="mb-2 ml-1 block text-[11px] font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                                        Nama Path
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={createForm.data.name}
                                        onChange={(e) =>
                                            createForm.setData(
                                                'name',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Contoh: Pengenalan HTML & CSS"
                                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm transition-all focus:border-transparent focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 ml-1 block text-[11px] font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                                        Deskripsi Singkat
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={createForm.data.description}
                                        onChange={(e) =>
                                            createForm.setData(
                                                'description',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Jelaskan secara ringkas materi yang akan dipelajari..."
                                        className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm transition-all focus:border-transparent focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                                    />
                                </div>

                                <div className="border-slate-150 flex items-center gap-3 border-t pt-3 dark:border-slate-800">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setCreateModalPhase(null)
                                        }
                                        className="flex-1 cursor-pointer rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-500 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-900"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={createForm.processing}
                                        className="flex-1 cursor-pointer rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition-all hover:bg-indigo-700 disabled:opacity-50"
                                    >
                                        {createForm.processing
                                            ? 'Menyimpan...'
                                            : 'Simpan Path'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* ================= MODAL: EDIT PATH ================= */}
                {editingPath && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs transition-opacity duration-300">
                        <div className="relative w-full max-w-md animate-in rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl duration-200 zoom-in-95 fade-in dark:border-slate-800 dark:bg-slate-950">
                            {/* Close button */}
                            <button
                                type="button"
                                onClick={() => setEditingPath(null)}
                                className="absolute top-4 right-4 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-900 dark:hover:text-slate-200"
                            >
                                <X className="h-5 w-5" />
                            </button>

                            <div className="mb-5 flex items-center gap-3">
                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
                                    <Edit className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                                        Ubah Informasi Path
                                    </h3>
                                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                                        Perbarui nama dan deskripsi untuk path
                                        terpilih.
                                    </p>
                                </div>
                            </div>

                            <form
                                onSubmit={handleEditPath}
                                className="space-y-4"
                            >
                                <div>
                                    <label className="mb-2 ml-1 block text-[11px] font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                                        Nama Path
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={editForm.data.name}
                                        onChange={(e) =>
                                            editForm.setData(
                                                'name',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Masukkan nama path..."
                                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm transition-all focus:border-transparent focus:ring-2 focus:ring-indigo-600 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 ml-1 block text-[11px] font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                                        Deskripsi Singkat
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={editForm.data.description}
                                        onChange={(e) =>
                                            editForm.setData(
                                                'description',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Jelaskan secara ringkas materi yang akan dipelajari..."
                                        className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm transition-all focus:border-transparent focus:ring-2 focus:ring-indigo-600 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-indigo-500"
                                    />
                                </div>

                                <div className="border-slate-150 dark:border-slate-850 flex items-center gap-3 border-t pt-3">
                                    <button
                                        type="button"
                                        onClick={() => setEditingPath(null)}
                                        className="flex-1 cursor-pointer rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-500 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-900"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={editForm.processing}
                                        className="flex-1 cursor-pointer rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition-all hover:bg-indigo-700 disabled:opacity-50"
                                    >
                                        {editForm.processing
                                            ? 'Menyimpan...'
                                            : 'Simpan Perubahan'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* ================= MODAL: DELETE CONFIRM ================= */}
                {deletingPath && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs transition-opacity duration-300">
                        <div className="relative w-full max-w-md animate-in rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl duration-200 zoom-in-95 fade-in dark:border-slate-800 dark:bg-slate-950">
                            <div className="flex flex-col items-center text-center">
                                <div className="mb-4 animate-bounce rounded-full border border-rose-100 bg-rose-50 p-3.5 text-rose-500 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-400">
                                    <AlertTriangle className="h-8 w-8" />
                                </div>

                                <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                                    Hapus Path Pembelajaran?
                                </h3>

                                <p className="mt-2 max-w-xs text-sm text-slate-500 dark:text-slate-400">
                                    Apakah Anda yakin ingin menghapus path{' '}
                                    <span className="font-bold text-slate-800 dark:text-white">
                                        "{deletingPath.name}"
                                    </span>
                                    ? Semua modul, konten materi, dan kuis di
                                    dalamnya akan dihapus permanen.
                                </p>
                            </div>

                            <div className="border-slate-150 dark:border-slate-850 mt-6 flex items-center gap-3 border-t pt-4">
                                <button
                                    type="button"
                                    onClick={() => setDeletingPath(null)}
                                    className="flex-1 cursor-pointer rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-500 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-900"
                                >
                                    Batal
                                </button>
                                <button
                                    type="button"
                                    onClick={handleDeletePath}
                                    className="flex-1 cursor-pointer rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-rose-500/20 transition-all hover:bg-rose-500"
                                >
                                    Ya, Hapus
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
