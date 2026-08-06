import AppLayout from '@/layouts/app-layout';
import { Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { ArrowLeft, ClipboardList } from 'lucide-react';
import {
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { Path, Group, CourseInfo } from '@/types/paths';
import PathColumnSection from '@/components/Mentor/Paths/PathColumnSection';
import CreatePathModal from '@/components/Mentor/Paths/CreatePathModal';
import EditPathModal from '@/components/Mentor/Paths/EditPathModal';
import DeletePathModal from '@/components/Mentor/Paths/DeletePathModal';

interface Props {
    group: Group;
    paths: Path[];
    basic_paths?: Path[];
    course?: CourseInfo | null;
}

export default function Index({
    group,
    paths,
    basic_paths = [],
    course,
}: Props) {
    const isBranchPublished =
        group.status === 'published' || group.status === 'completed';
    const isCoursePublished = course?.status === 'published';

    // Local sortable lists
    const [careerList, setCareerList] = useState<Path[]>(paths);
    const [basicList, setBasicList] = useState<Path[]>(basic_paths);

    // Modal state
    const [createModalPhase, setCreateModalPhase] = useState<
        'basic_fundamental' | 'career_branch' | null
    >(null);
    const [editingPath, setEditingPath] = useState<Path | null>(null);
    const [deletingPath, setDeletingPath] = useState<Path | null>(null);

    useEffect(() => {
        setCareerList(paths);
    }, [paths]);

    useEffect(() => {
        setBasicList(basic_paths);
    }, [basic_paths]);

    // Drag-and-Drop sensors
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
    );

    // Reorder Handlers
    const handleBasicDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = basicList.findIndex((item) => item.id === active.id);
        const newIndex = basicList.findIndex((item) => item.id === over.id);
        if (oldIndex === -1 || newIndex === -1) return;

        const newOrder = arrayMove(basicList, oldIndex, newIndex);
        setBasicList(newOrder);

        router.post(
            `/mentor/career-groups/${group.slug || group.id}/paths/reorder-fundamentals`,
            {
                basic_path_ids: newOrder.map((p) => p.id),
            },
            { preserveScroll: true },
        );
    };

    const handleCareerDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = careerList.findIndex((item) => item.id === active.id);
        const newIndex = careerList.findIndex((item) => item.id === over.id);
        if (oldIndex === -1 || newIndex === -1) return;

        const newOrder = arrayMove(careerList, oldIndex, newIndex);
        setCareerList(newOrder);

        router.post(
            `/mentor/career-groups/${group.slug || group.id}/paths/reorder`,
            {
                path_ids: newOrder.map((p) => p.id),
            },
            { preserveScroll: true },
        );
    };

    // Toggle Status Handlers
    const handleToggleStatus = () => {
        const nextStatus = isBranchPublished ? 'draft' : 'published';
        router.post(
            `/mentor/career-groups/${group.slug || group.id}/status`,
            { status: nextStatus },
            { preserveScroll: true },
        );
    };

    const handleToggleCourseStatus = () => {
        if (!course) return;
        router.post(
            `/admin/courses/${course.slug || course.id}/publish`,
            {},
            { preserveScroll: true },
        );
    };

    return (
        <AppLayout title={`Atur Learning Paths - ${group.name}`}>
            <div className="space-y-8 p-6 sm:p-8">
                {/* Header Section */}
                <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
                    <div className="flex items-start gap-3 sm:items-center sm:gap-4">
                        <Link
                            href="/mentor/dashboard"
                            className="shrink-0 rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 shadow-sm transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <div className="min-w-0">
                            <h1 className="text-xl font-bold tracking-tight text-slate-800 sm:text-2xl dark:text-white">
                                Atur Learning Paths
                            </h1>
                            <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                Branch:{' '}
                                <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                                    {group.name}
                                </span>
                                {isBranchPublished ? (
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                        Branch Published
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                                        Branch Draft
                                    </span>
                                )}
                                <span className="mx-1 text-slate-300 dark:text-slate-700">
                                    •
                                </span>
                                Course Utama:
                                {isCoursePublished ? (
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                        Course Published
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                                        Course Draft
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <Link
                            href={`/mentor/career-groups/${group.slug || group.id}/submissions`}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:border-slate-400 hover:text-slate-900 active:scale-95 sm:w-auto dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-slate-500 dark:hover:text-white"
                        >
                            <ClipboardList className="h-4 w-4" />
                            <span>Kelola Submission Siswa</span>
                        </Link>
                    </div>
                </div>

                {/* TWO-COLUMN GRID */}
                <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-12">
                    {/* LEFT COLUMN: Basic Fundamentals */}
                    <div className="lg:col-span-6">
                        <PathColumnSection
                            type="basic_fundamental"
                            group={group}
                            paths={basicList}
                            isPublished={isCoursePublished ?? false}
                            sensors={sensors}
                            onDragEnd={handleBasicDragEnd}
                            onToggleStatus={handleToggleCourseStatus}
                            onOpenCreateModal={(type) =>
                                setCreateModalPhase(type)
                            }
                            onEditPath={(path) => setEditingPath(path)}
                            onDeletePath={(path) => setDeletingPath(path)}
                        />
                    </div>

                    {/* RIGHT COLUMN: Career Branch Progression */}
                    <div className="lg:col-span-6">
                        <PathColumnSection
                            type="career_branch"
                            group={group}
                            paths={careerList}
                            isPublished={isBranchPublished}
                            sensors={sensors}
                            onDragEnd={handleCareerDragEnd}
                            onToggleStatus={handleToggleStatus}
                            onOpenCreateModal={(type) =>
                                setCreateModalPhase(type)
                            }
                            onEditPath={(path) => setEditingPath(path)}
                            onDeletePath={(path) => setDeletingPath(path)}
                        />
                    </div>
                </div>

                {/* MODALS */}
                <CreatePathModal
                    group={group}
                    phase={createModalPhase}
                    onClose={() => setCreateModalPhase(null)}
                />

                <EditPathModal
                    group={group}
                    path={editingPath}
                    onClose={() => setEditingPath(null)}
                />

                <DeletePathModal
                    group={group}
                    path={deletingPath}
                    onClose={() => setDeletingPath(null)}
                />
            </div>
        </AppLayout>
    );
}
