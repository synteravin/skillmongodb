import AppLayout from '@/layouts/app-layout';
import { useForm, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Map, Plus, Edit, Trash2, ClipboardList, Layers, ArrowLeft, GripVertical, X, Check, AlertTriangle } from 'lucide-react';
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Path {
    id: string;
    name: string;
    description?: string;
    order: number;
}

interface Group {
    id: string;
    name: string;
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

function SortablePathCard({ path, index, group, onEdit, onDelete, isFundamental = false }: SortablePathCardProps) {
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
            className="group relative flex flex-col p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/30 hover:bg-slate-50 dark:hover:bg-slate-900/60 hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-all shadow-sm hover:shadow-md relative overflow-hidden"
        >
            {/* Left accent line */}
            <div className={`absolute top-0 left-0 w-[3px] h-full transition-opacity ${isFundamental ? 'bg-indigo-500' : 'bg-slate-400 dark:bg-slate-500'} opacity-0 group-hover:opacity-100`}></div>

            {/* Top content row */}
            <div className="flex items-start gap-4 w-full">
                {/* Drag Handle */}
                <div
                    {...attributes}
                    {...listeners}
                    className="cursor-grab p-1.5 text-slate-400 hover:text-indigo-650 dark:hover:text-indigo-400 transition-colors flex items-center justify-center shrink-0 touch-none mt-1"
                    title="Tarik untuk memindahkan"
                >
                    <GripVertical size={18} />
                </div>

                {/* Number Badge */}
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center font-bold shrink-0 shadow-xs ${
                    isFundamental 
                        ? 'border-indigo-100 dark:border-indigo-900 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-750 dark:text-indigo-300' 
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-655 dark:text-slate-350'
                }`}>
                    {index + 1}
                </div>

                {/* Text Block */}
                <div className="flex-1 min-w-0" style={{ display: 'block' }}>
                    <h3 
                        className="font-bold leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors"
                        style={{ color: '#ffffff', fontSize: '16px', margin: 0, padding: 0 }}
                    >
                        {path.name || 'Nama Path Tidak Tersedia'}
                    </h3>
                    <p 
                        className="mt-2 leading-relaxed" 
                        style={{ color: '#94a3b8', fontSize: '13px', margin: 0, padding: 0 }}
                    >
                        {path.description || 'Tidak ada deskripsi.'}
                    </p>
                </div>
            </div>

            {/* Bottom Actions Row */}
            <div className="flex items-center justify-end gap-2 mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800/60 w-full">
                <button
                    type="button"
                    onClick={() => onEdit(path)}
                    className="inline-flex items-center gap-1.5 h-8 px-3 text-xs font-semibold rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer"
                    title="Ubah Nama/Deskripsi"
                >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Ubah</span>
                </button>

                <Link
                    href={`/mentor/career-groups/${group.id}/paths/${path.id}/modules`}
                    className={`inline-flex items-center gap-1.5 h-8 px-3 text-xs font-semibold rounded-lg border transition-colors ${
                        isFundamental 
                            ? 'bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-750 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 hover:text-indigo-900 dark:hover:text-indigo-100 border-indigo-200 dark:border-indigo-900/60' 
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white border-slate-200 dark:border-slate-700'
                    }`}
                    title="Edit Detail Materi / Modul"
                >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Materi</span>
                </Link>

                <button
                    type="button"
                    onClick={() => onDelete(path)}
                    className="inline-flex items-center gap-1.5 h-8 px-3 text-xs font-semibold rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-rose-50 dark:hover:bg-rose-955/40 hover:text-rose-600 dark:hover:text-rose-450 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                    title="Hapus Path"
                >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus</span>
                </button>
            </div>
        </div>
    );
}



/* ================= MAIN COMPONENT ================= */
export default function Index({ group, paths, basic_paths = [] }: Props) {
    const [basicList, setBasicList] = useState<Path[]>(basic_paths);
    const [careerList, setCareerList] = useState<Path[]>(paths);

    const [createModalPhase, setCreateModalPhase] = useState<'basic_fundamental' | 'career_branch' | null>(null);
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
            activationConstraint: { distance: 5 }
        })
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
            phase: phase
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
            }
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
            }
        });
    };

    const handleDeletePath = () => {
        if (!deletingPath) return;

        router.delete(`/mentor/paths/${deletingPath.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setDeletingPath(null);
            }
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

        router.put('/mentor/paths/reorder', {
            paths: newItems.map((item, i) => ({
                id: item.id,
                order: i + 1
            }))
        }, {
            preserveScroll: true
        });
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

        router.put('/mentor/paths/reorder', {
            paths: newItems.map((item, i) => ({
                id: item.id,
                order: i + 1
            }))
        }, {
            preserveScroll: true
        });
    };

    return (
        <AppLayout>
            <div className="w-full mx-auto space-y-8 p-4 sm:p-6 lg:p-8" style={{ fontFamily: "'Outfit', sans-serif" }}>

                {/* Header Section */}
                <div className="flex items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
                    <div className="flex items-center gap-4">
                        <Link
                            href={`/mentor/dashboard`}
                            className="p-2.5 rounded-xl bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors shadow-sm"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white">
                                Atur Learning Paths
                            </h1>
                            <p className="text-sm text-slate-550 dark:text-slate-400 mt-1">
                                Branch Karir: <span className="font-semibold text-indigo-600 dark:text-indigo-400">{group.name}</span>
                            </p>
                        </div>
                    </div>

                    <Link
                        href={`/mentor/career-groups/${group.id}/submissions`}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 shadow-sm transition-all font-semibold text-sm active:scale-95"
                    >
                        <ClipboardList className="w-4 h-4" />
                        <span>Kelola Submisi Siswa</span>
                    </Link>
                </div>

                {/* TWO-COLUMN GRID */}
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* ================= LEFT COLUMN: Basic Fundamentals ================= */}
                    <div className="lg:col-span-6">
                        <div className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col font-outfit min-h-[400px]">
                            <div className="absolute inset-0 bg-white dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]" />
                            <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700" />

                            {/* Card Header */}
                            <div className="relative z-10 p-6 border-b border-slate-200 dark:border-slate-800/60 flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800/40">
                                        <Layers className="w-5.5 h-5.5" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                            Basic Fundamentals (Open Source)
                                            <span className="inline-flex items-center justify-center bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 text-xs font-bold px-2 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800">
                                                {basicList.length}
                                            </span>
                                        </h2>
                                        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                                            Materi dasar bersama yang diedit kolaboratif oleh seluruh mentor.
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => openCreateModal('basic_fundamental')}
                                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-550 text-white rounded-lg transition-all shadow-md shadow-indigo-500/10 cursor-pointer active:scale-95"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>Tambah Path</span>
                                </button>
                            </div>

                            {/* Paths List */}
                            <div className="relative z-10 p-6 flex-1 flex flex-col min-h-0">
                                {basicList.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center flex-1 min-h-[250px] text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-800/20 p-6">
                                        <Layers className="w-12 h-12 text-slate-300 dark:text-slate-700 mb-3" />
                                        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs">
                                            Tidak ada materi Basic Fundamental yang tersedia. Silakan klik Tambah Path untuk membuatnya.
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
                                            strategy={verticalListSortingStrategy}
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

                    {/* ================= RIGHT COLUMN: Learning Progression ================= */}
                    <div className="lg:col-span-6">
                        <div className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col font-outfit min-h-[400px]">
                            <div className="absolute inset-0 bg-white dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]" />
                            <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700" />

                            {/* Card Header */}
                            <div className="relative z-10 p-6 border-b border-slate-200 dark:border-slate-800/60 flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                                        <Map className="w-5.5 h-5.5" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                            Progression (Career Branch)
                                            <span className="inline-flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-655 dark:text-slate-300 text-xs font-bold px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
                                                {careerList.length}
                                            </span>
                                        </h2>
                                        <p className="text-[11px] text-slate-450 dark:text-slate-500 mt-1">
                                            Kurikulum berjenjang spesifik untuk branch karir ini.
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => openCreateModal('career_branch')}
                                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 shadow-sm rounded-lg transition-all cursor-pointer active:scale-95"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>Tambah Path</span>
                                </button>
                            </div>

                            {/* Paths List */}
                            <div className="relative z-10 p-6 flex-1 flex flex-col min-h-0">
                                {careerList.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center flex-1 min-h-[250px] text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-800/20 p-6">
                                        <Map className="w-12 h-12 text-slate-300 dark:text-slate-700 mb-3" />
                                        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs">
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
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300">
                        <div className="relative bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                            
                            {/* Close button */}
                            <button
                                type="button"
                                onClick={() => setCreateModalPhase(null)}
                                className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="flex items-center gap-3 mb-5">
                                <div className={`p-2.5 rounded-xl border ${createModalPhase === 'basic_fundamental' ? 'bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-950/60 dark:border-indigo-900 dark:text-indigo-400' : 'bg-slate-100 border-slate-200 text-slate-600 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400'}`}>
                                    <Plus className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                                        Tambah Path Baru
                                    </h3>
                                    <p className="text-xs text-slate-550 dark:text-slate-400 mt-0.5">
                                        {createModalPhase === 'basic_fundamental' 
                                            ? 'Membuat materi Basic Fundamental (Course Utama)' 
                                            : 'Membuat materi Progression (Career Branch)'}
                                    </p>
                                </div>
                            </div>

                            <form onSubmit={handleCreatePath} className="space-y-4">
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 ml-1">
                                        Nama Path
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={createForm.data.name}
                                        onChange={(e) => createForm.setData('name', e.target.value)}
                                        placeholder="Contoh: Pengenalan HTML & CSS"
                                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 ml-1">
                                        Deskripsi Singkat
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={createForm.data.description}
                                        onChange={(e) => createForm.setData('description', e.target.value)}
                                        placeholder="Jelaskan secara ringkas materi yang akan dipelajari..."
                                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm resize-none"
                                    />
                                </div>

                                <div className="flex items-center gap-3 pt-3 border-t border-slate-150 dark:border-slate-800">
                                    <button
                                        type="button"
                                        onClick={() => setCreateModalPhase(null)}
                                        className="flex-1 px-4 py-2.5 text-sm font-semibold border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl transition-colors cursor-pointer"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={createForm.processing}
                                        className="flex-1 px-4 py-2.5 text-sm font-semibold bg-indigo-650 hover:bg-indigo-600 text-white rounded-xl transition-all shadow-md shadow-indigo-500/20 disabled:opacity-50 cursor-pointer"
                                    >
                                        {createForm.processing ? 'Menyimpan...' : 'Simpan Path'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* ================= MODAL: EDIT PATH ================= */}
                {editingPath && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300">
                        <div className="relative bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                            
                            {/* Close button */}
                            <button
                                type="button"
                                onClick={() => setEditingPath(null)}
                                className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="flex items-center gap-3 mb-5">
                                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400">
                                    <Edit className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                                        Ubah Informasi Path
                                    </h3>
                                    <p className="text-xs text-slate-550 dark:text-slate-400 mt-0.5">
                                        Perbarui nama dan deskripsi untuk path terpilih.
                                    </p>
                                </div>
                            </div>

                            <form onSubmit={handleEditPath} className="space-y-4">
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 ml-1">
                                        Nama Path
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={editForm.data.name}
                                        onChange={(e) => editForm.setData('name', e.target.value)}
                                        placeholder="Masukkan nama path..."
                                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-550 focus:border-transparent transition-all shadow-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 ml-1">
                                        Deskripsi Singkat
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={editForm.data.description}
                                        onChange={(e) => editForm.setData('description', e.target.value)}
                                        placeholder="Jelaskan secara ringkas materi yang akan dipelajari..."
                                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-550 focus:border-transparent transition-all shadow-sm resize-none"
                                    />
                                </div>

                                <div className="flex items-center gap-3 pt-3 border-t border-slate-150 dark:border-slate-850">
                                    <button
                                        type="button"
                                        onClick={() => setEditingPath(null)}
                                        className="flex-1 px-4 py-2.5 text-sm font-semibold border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl transition-colors cursor-pointer"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={editForm.processing}
                                        className="flex-1 px-4 py-2.5 text-sm font-semibold bg-indigo-650 hover:bg-indigo-600 text-white rounded-xl transition-all shadow-md shadow-indigo-500/20 disabled:opacity-50 cursor-pointer"
                                    >
                                        {editForm.processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* ================= MODAL: DELETE CONFIRM ================= */}
                {deletingPath && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300">
                        <div className="relative bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                            
                            <div className="flex flex-col items-center text-center">
                                <div className="p-3.5 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-500 dark:text-rose-400 border border-rose-100 dark:border-rose-900/50 mb-4 animate-bounce">
                                    <AlertTriangle className="w-8 h-8" />
                                </div>
                                
                                <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                                    Hapus Path Pembelajaran?
                                </h3>
                                
                                <p className="text-sm text-slate-550 dark:text-slate-400 mt-2 max-w-xs">
                                    Apakah Anda yakin ingin menghapus path <span className="font-bold text-slate-800 dark:text-white">"{deletingPath.name}"</span>? Semua modul, konten materi, dan kuis di dalamnya akan dihapus permanen.
                                </p>
                            </div>

                            <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-150 dark:border-slate-850">
                                <button
                                    type="button"
                                    onClick={() => setDeletingPath(null)}
                                    className="flex-1 px-4 py-2.5 text-sm font-semibold border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl transition-colors cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    type="button"
                                    onClick={handleDeletePath}
                                    className="flex-1 px-4 py-2.5 text-sm font-semibold bg-rose-600 hover:bg-rose-500 text-white rounded-xl transition-all shadow-md shadow-rose-500/20 cursor-pointer"
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