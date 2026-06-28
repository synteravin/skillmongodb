import { useState } from 'react';
import { router, Link } from '@inertiajs/react';
import { Plus, FolderGit2, PlusCircle, Layers, ArrowLeft } from 'lucide-react';

import AppLayout from '@/layouts/app-layout';
import Modal from '@/components/ui/Modal';

import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    rectSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

type Module = {
    _id: string;
    title: string;
    slug: string;
};

type Path = {
    _id: string;
    name: string;
    modules: Module[];
    mentor?: Mentor | null;
};

type CareerGroup = {
    _id: string;
    name: string;
    paths: Path[];
    mentor?: Mentor | null;
};

type Course = {
    _id: string;
    title: string;
    basic_paths: Path[];
    career_groups: CareerGroup[];
};

type Mentor = {
    _id: string;
    name: string;
    avatar?: string | null;
    avatar_url?: string | null;
};

function SortablePathCard({ path }: { path: any }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: path._id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
    };

    const handleCardClick = (e: React.MouseEvent) => {
        const target = e.target as HTMLElement;
        if (
            target.closest('.cursor-grab') ||
            target.closest('a') ||
            target.closest('button')
        ) {
            return;
        }
        router.visit(`/admin/paths/${path._id}/modules`);
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            onClick={handleCardClick}
            className="group relative cursor-pointer rounded-xl border border-slate-200 bg-white p-4 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-500/40 hover:shadow-md dark:border-slate-800 dark:bg-[#0b0e14] dark:hover:border-indigo-500/30 dark:hover:bg-[#0e121a]/85"
        >
            {/* Drag Handle */}
            <div
                {...attributes}
                {...listeners}
                className="dark:hover:bg-slate-850 absolute top-3 right-3 cursor-grab rounded-lg p-1.5 text-slate-400 opacity-100 transition-all duration-200 hover:bg-slate-100 active:cursor-grabbing md:opacity-0 md:group-hover:opacity-100 dark:text-slate-500"
                title="Tarik untuk memindahkan"
            >
                <svg
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-4 w-4"
                >
                    <path
                        fillRule="evenodd"
                        d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM10 8.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM10 14a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM5 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM5 8.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM5 14a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM15 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM15 8.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM15 14a1.5 1.5 0 110 3 1.5 1.5 0 010-3z"
                        clipRule="evenodd"
                    />
                </svg>
            </div>

            <div className="mb-3 flex items-center justify-between gap-2.5 pr-8">
                <Link
                    href={`/admin/paths/${path._id}/modules`}
                    className="text-slate-850 truncate text-xs font-bold transition-colors hover:text-[#3B28F6] hover:underline dark:text-white dark:hover:text-indigo-400"
                >
                    {path.name}
                </Link>
            </div>

            <div className="space-y-1.5">
                {path.modules?.length === 0 ? (
                    <p className="pl-1 text-[10px] text-slate-400 italic dark:text-slate-500">
                        Empty path
                    </p>
                ) : (
                    path.modules?.map((module: any) => (
                        <div
                            key={String(module._id)}
                            className="group/mod flex items-center gap-2"
                            title={module.title}
                        >
                            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-slate-300 transition-colors group-hover/mod:bg-indigo-500 dark:bg-slate-700 dark:group-hover/mod:bg-indigo-400" />
                            <span className="truncate text-[10.5px] text-slate-500 transition-colors group-hover/mod:text-slate-800 dark:text-slate-400 dark:group-hover/mod:text-slate-200">
                                {module.title}
                            </span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default function Builder({
    course,
    mentors,
}: {
    course: Course;
    mentors: Mentor[];
}) {
    /* ================= MODAL STATE ================= */
    const [openCareerGroup, setOpenCareerGroup] = useState(false);
    const [openBasicPath, setOpenBasicPath] = useState(false);
    const [openCareerPath, setOpenCareerPath] = useState(false);
    const [openAssignMentor, setOpenAssignMentor] = useState(false);

    /* ================= FORM STATE ================= */
    const [careerGroupName, setCareerGroupName] = useState('');
    const [basicPathName, setBasicPathName] = useState('');
    const [careerPathName, setCareerPathName] = useState('');
    const [careerGroupId, setCareerGroupId] = useState<string | null>(null);
    const [selectedPathId, setSelectedPathId] = useState<string | null>(null);
    const [assignedMentorId, setAssignedMentorId] = useState<string>('');

    /* ================= DND CONFIG ================= */
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    );

    /* ================= HANDLERS ================= */
    function openCareerPathModal(groupId: string) {
        if (!groupId) return;
        setCareerGroupId(groupId);
        setCareerPathName('');
        setOpenCareerPath(true);
    }

    function createCareerGroup() {
        if (!careerGroupName.trim()) return;
        router.post(
            '/admin/career-groups',
            {
                course_id: String(course._id),
                name: careerGroupName,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setCareerGroupName('');
                    setOpenCareerGroup(false);
                },
            },
        );
    }

    function createBasicPath() {
        if (!basicPathName.trim()) return;
        router.post(
            '/admin/paths',
            {
                course_id: String(course._id),
                phase: 'basic_fundamental',
                name: basicPathName,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setBasicPathName('');
                    setOpenBasicPath(false);
                },
            },
        );
    }

    function createCareerPath() {
        console.log('CREATE CAREER PATH 🔥', {
            careerGroupId,
            name: careerPathName,
        });
        if (!careerGroupId || !careerPathName.trim()) return;
        router.post(
            '/admin/paths',
            {
                course_id: String(course._id),
                career_group_id: String(careerGroupId),
                phase: 'career_branch',
                name: careerPathName.trim(),
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setCareerPathName('');
                    setCareerGroupId(null);
                    setOpenCareerPath(false);
                },
            },
        );
    }

    function handleBasicDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = course.basic_paths.findIndex(
            (p) => p._id === active.id,
        );
        const newIndex = course.basic_paths.findIndex((p) => p._id === over.id);

        const newPaths = arrayMove(course.basic_paths, oldIndex, newIndex);

        const payload = newPaths.map((p, index) => ({
            id: p._id,
            order: index + 1,
        }));

        router.put(
            '/admin/paths/reorder',
            {
                paths: payload,
            },
            {
                preserveScroll: true,
            },
        );
    }

    function handleCareerDragEnd(event: DragEndEvent, groupId: string) {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const group = course.career_groups.find((g) => g._id === groupId);
        if (!group) return;

        const oldIndex = group.paths.findIndex((p) => p._id === active.id);
        const newIndex = group.paths.findIndex((p) => p._id === over.id);

        const newPaths = arrayMove(group.paths, oldIndex, newIndex);

        const payload = newPaths.map((p, index) => ({
            id: p._id,
            order: index + 1,
        }));

        router.put(
            '/admin/paths/reorder',
            {
                paths: payload,
            },
            {
                preserveScroll: true,
            },
        );
    }

    function handleManageMentor(
        pathId: string,
        currentMentorId: string | null,
    ) {
        setSelectedPathId(pathId);
        setAssignedMentorId(currentMentorId || '');
        setOpenAssignMentor(true);
    }

    function submitMentorAssignment() {
        if (!selectedPathId) return;
        router.post(
            `/admin/career-groups/${selectedPathId}/assign-mentor`,
            {
                mentor_id: assignedMentorId || null,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setOpenAssignMentor(false);
                    setSelectedPathId(null);
                    setAssignedMentorId('');
                },
            },
        );
    }
    return (
        <AppLayout>
            <div
                className="min-h-screen bg-[#f8fafc] px-4 py-8 text-slate-800 transition-colors duration-200 sm:px-6 lg:px-8 dark:bg-[#030712] dark:text-white"
                style={{ fontFamily: "'Outfit', sans-serif" }}
            >
                <div className="mx-auto w-full space-y-8">
                    {/* ================= HEADER HERO SECTION ================= */}
                    <header
                        className="relative overflow-hidden rounded-xl border border-slate-200 bg-white px-6 py-5 shadow-sm dark:border-slate-800 dark:bg-[#0d0f17]"
                        style={{
                            backgroundImage: `
                            linear-gradient(rgba(59,40,246,0.03) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(59,40,246,0.03) 1px, transparent 1px)
                            `,
                            backgroundSize: '40px 40px',
                        }}
                    >
                        {/* Corner brackets */}
                        <span className="absolute top-3.5 left-3.5 h-3 w-3 border-t border-l border-slate-200 dark:border-[rgba(59,40,246,0.35)]" />
                        <span className="absolute top-3.5 right-3.5 h-3 w-3 border-t border-r border-slate-200 dark:border-[rgba(59,40,246,0.35)]" />
                        <span className="absolute bottom-3.5 left-3.5 h-3 w-3 border-b border-l border-slate-200 dark:border-[rgba(59,40,246,0.35)]" />
                        <span className="absolute right-3.5 bottom-3.5 h-3 w-3 border-r border-b border-slate-200 dark:border-[rgba(59,40,246,0.35)]" />

                        <div className="relative z-10 flex flex-col gap-3">
                            <div className="flex items-center gap-3">
                                {/* Back button */}
                                <Link
                                    href="/admin/courses"
                                    className="group rounded-xl bg-slate-100 p-2.5 text-slate-500 transition-all hover:bg-slate-200 hover:text-slate-900 dark:bg-slate-800/50 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white"
                                    title="Back to Courses"
                                >
                                    <ArrowLeft
                                        size={18}
                                        className="transition-transform group-hover:-translate-x-1"
                                    />
                                </Link>
                                <div className="h-8 w-px bg-slate-200 dark:bg-slate-800/60" />

                                {/* Badge */}
                                <div className="inline-flex w-fit items-center gap-1.5 rounded border border-slate-200 bg-slate-50 px-2.5 py-1 text-slate-600 dark:border-[rgba(59,40,246,0.35)] dark:bg-[rgba(59,40,246,0.1)] dark:text-[#7C5CFF]">
                                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#3B28F6]" />
                                    <span className="text-[10px] font-bold tracking-[0.12em] uppercase">
                                        Course Builder Workspace
                                    </span>
                                </div>
                            </div>

                            {/* Title */}
                            <h1
                                className="m-0 text-2xl leading-none font-bold tracking-tight sm:text-3xl"
                                style={{
                                    background:
                                        'linear-gradient(135deg, #2a1ce0 0%, #3B28F6 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                    fontFamily: 'Orbitron, sans-serif',
                                }}
                            >
                                {course.title}
                            </h1>

                            {/* Subtitle */}
                            <p className="m-0 text-xs text-slate-500 sm:text-sm dark:text-slate-400">
                                Design and structure your curriculum by
                                organizing basic fundamentals and career paths.
                            </p>
                        </div>
                    </header>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                        {/* ================= LEFT COLUMN (Basic Fundamentals) ================= */}
                        <div className="lg:col-span-5">
                            <div
                                className="relative flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]"
                                style={{ fontFamily: "'Outfit', sans-serif" }}
                            >
                                {/* Top accent line */}
                                <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700" />

                                {/* Card Header */}
                                <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3.5 sm:px-6 dark:border-white/5">
                                    <div>
                                        <h2 className="text-sm font-bold tracking-[0.2em] text-slate-800 uppercase dark:text-white">
                                            Basic Fundamentals
                                        </h2>
                                        <p className="mt-0.5 text-[10px] text-slate-400 dark:text-slate-500">
                                            Foundation paths for all students
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setOpenBasicPath(true)}
                                        className="inline-flex items-center gap-1.5 rounded border border-slate-200 bg-slate-50 px-3 py-1.5 text-[10px] font-bold tracking-widest text-slate-600 uppercase transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:bg-slate-800"
                                        title="Add Path"
                                    >
                                        <Plus className="h-3 w-3" />
                                        Add Path
                                    </button>
                                </div>

                                <div className="space-y-3 p-5 sm:p-6">
                                    {course.basic_paths?.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-12 text-center">
                                            <Layers className="mx-auto mb-3 h-8 w-8 text-slate-300 dark:text-slate-700" />
                                            <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase dark:text-slate-500">
                                                No fundamental paths yet
                                            </p>
                                        </div>
                                    ) : (
                                        <DndContext
                                            sensors={sensors}
                                            collisionDetection={closestCenter}
                                            onDragEnd={handleBasicDragEnd}
                                        >
                                            <SortableContext
                                                items={course.basic_paths.map(
                                                    (p) => p._id,
                                                )}
                                                strategy={
                                                    verticalListSortingStrategy
                                                }
                                            >
                                                <div className="space-y-3">
                                                    {course.basic_paths?.map(
                                                        (path) => (
                                                            <SortablePathCard
                                                                key={String(
                                                                    path._id,
                                                                )}
                                                                path={path}
                                                            />
                                                        ),
                                                    )}
                                                </div>
                                            </SortableContext>
                                        </DndContext>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* ================= RIGHT COLUMN (Career Paths) ================= */}
                        <div className="lg:col-span-7">
                            <div
                                className="relative flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]"
                                style={{ fontFamily: "'Outfit', sans-serif" }}
                            >
                                {/* Top accent line */}
                                <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700" />

                                {/* Card Header */}
                                <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3.5 sm:px-6 dark:border-white/5">
                                    <div>
                                        <h2 className="text-sm font-bold tracking-[0.2em] text-slate-800 uppercase dark:text-white">
                                            Career Paths
                                        </h2>
                                        <p className="mt-0.5 text-[10px] text-slate-400 dark:text-slate-500">
                                            Group paths by career trajectory
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setOpenCareerGroup(true)}
                                        className="inline-flex items-center gap-1.5 rounded border border-slate-200 bg-slate-50 px-3 py-1.5 text-[10px] font-bold tracking-widest text-slate-600 uppercase transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:bg-slate-800"
                                    >
                                        <PlusCircle className="h-3 w-3" />
                                        New Group
                                    </button>
                                </div>

                                {/* Card Body */}
                                <div className="space-y-4 p-5 sm:p-6">
                                    {course.career_groups?.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-12 text-center">
                                            <FolderGit2 className="mx-auto mb-3 h-8 w-8 text-slate-300 dark:text-slate-700" />
                                            <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase dark:text-slate-500">
                                                No career groups yet
                                            </p>
                                            <p className="mt-1.5 max-w-xs text-[10px] text-slate-400 dark:text-slate-600">
                                                Create career groups to organize
                                                specific learning paths for
                                                different professional roles.
                                            </p>
                                        </div>
                                    ) : (
                                        course.career_groups?.map((group) => (
                                            <div
                                                key={String(group._id)}
                                                className="overflow-hidden rounded-xl border border-slate-200 bg-white/40 shadow-xs backdrop-blur-xs dark:border-slate-800 dark:bg-slate-950/20"
                                            >
                                                {/* Group Header */}
                                                <div className="flex flex-col justify-between gap-4 border-b border-slate-200 bg-slate-50/70 px-5 py-4 lg:flex-row lg:items-center dark:border-slate-800/80 dark:bg-slate-900/40">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#3B28F6] shadow-[0_0_8px_rgba(59,40,246,0.5)] dark:bg-indigo-500 dark:shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                                                        <span className="text-slate-805 font-['Orbitron'] text-sm font-bold tracking-wider uppercase dark:text-white">
                                                            {group.name}
                                                        </span>
                                                    </div>

                                                    <div className="flex w-full flex-wrap items-center justify-between gap-3 sm:gap-4 lg:w-auto lg:justify-end">
                                                        {/* MENTOR INFOS */}
                                                        {group.mentor ? (
                                                            <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white/60 px-3 py-1.5 shadow-xs dark:border-slate-800/80 dark:bg-slate-900/60">
                                                                {group.mentor
                                                                    .avatar_url ? (
                                                                    <img
                                                                        src={
                                                                            group
                                                                                .mentor
                                                                                .avatar_url
                                                                        }
                                                                        className="h-7 w-7 rounded-full border border-slate-200 object-cover shadow-xs dark:border-slate-700"
                                                                        alt="mentor"
                                                                    />
                                                                ) : (
                                                                    <div className="to-purple-650 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-indigo-500 bg-gradient-to-br from-indigo-500 shadow-xs">
                                                                        <span className="text-[10px] font-bold text-white">
                                                                            {group.mentor.name
                                                                                .charAt(
                                                                                    0,
                                                                                )
                                                                                .toUpperCase()}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                                <div className="flex max-w-[120px] flex-col truncate sm:max-w-[180px]">
                                                                    <span className="truncate text-[10px] leading-tight font-bold text-slate-800 dark:text-[#F3F4F6]">
                                                                        {
                                                                            group
                                                                                .mentor
                                                                                .name
                                                                        }
                                                                    </span>
                                                                    <span className="text-slate-450 truncate text-[8px] font-medium tracking-wider uppercase dark:text-slate-500">
                                                                        Branch
                                                                        Mentor
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center gap-2 rounded-xl border border-slate-200/60 bg-slate-100/50 px-3 py-1.5 dark:border-slate-800/40 dark:bg-slate-900/30">
                                                                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-dashed border-slate-300 bg-slate-100 dark:border-slate-700 dark:bg-slate-900">
                                                                    <span className="text-slate-450 text-xs font-bold">
                                                                        ?
                                                                    </span>
                                                                </div>
                                                                <div className="flex flex-col">
                                                                    <span className="text-slate-450 text-[10px] font-bold dark:text-slate-500">
                                                                        Unassigned
                                                                    </span>
                                                                    <span className="text-slate-450 text-[8px] font-medium tracking-wider uppercase dark:text-slate-500">
                                                                        No
                                                                        Mentor
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        )}

                                                        <div className="dark:bg-slate-850 hidden h-6 w-px bg-slate-200 sm:block" />

                                                        {/* ACTIONS */}
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() =>
                                                                    handleManageMentor(
                                                                        group._id,
                                                                        group
                                                                            .mentor
                                                                            ?._id ||
                                                                            null,
                                                                    )
                                                                }
                                                                className="border-indigo-550/20 text-indigo-650 inline-flex shrink-0 cursor-pointer items-center rounded-lg border bg-indigo-500/10 px-3 py-1.5 font-['Orbitron'] text-[9px] font-bold tracking-wider uppercase shadow-xs transition-all hover:bg-[#3B28F6] hover:text-white dark:border-indigo-500/25 dark:bg-indigo-500/10 dark:text-indigo-300 dark:hover:bg-indigo-600 dark:hover:text-white"
                                                            >
                                                                Manage Mentor
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    openCareerPathModal(
                                                                        group._id,
                                                                    )
                                                                }
                                                                className="border-slate-205 inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-lg border bg-white px-3 py-1.5 text-[9px] font-bold tracking-wider text-slate-600 uppercase transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                                                            >
                                                                <Plus className="h-3.5 w-3.5" />
                                                                Path
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Paths Grid */}
                                                <div className="bg-white/30 p-5 dark:bg-transparent">
                                                    {group.paths?.length ===
                                                    0 ? (
                                                        <p className="py-6 text-center text-xs text-slate-400 italic dark:text-slate-500">
                                                            Belum ada path yang
                                                            ditambahkan ke group
                                                            ini.
                                                        </p>
                                                    ) : (
                                                        <DndContext
                                                            sensors={sensors}
                                                            collisionDetection={
                                                                closestCenter
                                                            }
                                                            onDragEnd={(e) =>
                                                                handleCareerDragEnd(
                                                                    e,
                                                                    group._id,
                                                                )
                                                            }
                                                        >
                                                            <SortableContext
                                                                items={group.paths.map(
                                                                    (p) =>
                                                                        p._id,
                                                                )}
                                                                strategy={
                                                                    verticalListSortingStrategy
                                                                }
                                                            >
                                                                <div className="space-y-3">
                                                                    {group.paths?.map(
                                                                        (
                                                                            path,
                                                                        ) => (
                                                                            <SortablePathCard
                                                                                key={String(
                                                                                    path._id,
                                                                                )}
                                                                                path={
                                                                                    path
                                                                                }
                                                                            />
                                                                        ),
                                                                    )}
                                                                </div>
                                                            </SortableContext>
                                                        </DndContext>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ================= MODALS ================= */}

                    {/* Modal: Create Career Group */}
                    <Modal
                        open={openCareerGroup}
                        title="Tambah Career Branch"
                        onClose={() => setOpenCareerGroup(false)}
                    >
                        <div
                            className="relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910] dark:shadow-none"
                            style={{ fontFamily: "'Outfit', sans-serif" }}
                        >
                            <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700" />

                            <div className="space-y-5 p-5 sm:p-6">
                                <div>
                                    <label className="mb-2 block text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase dark:text-slate-500">
                                        Nama Career Branch
                                    </label>
                                    <input
                                        value={careerGroupName}
                                        onChange={(e) =>
                                            setCareerGroupName(e.target.value)
                                        }
                                        placeholder="Frontend Web Developer"
                                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-slate-400 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500 dark:focus:border-slate-500"
                                        autoFocus
                                    />
                                </div>

                                <div className="h-px bg-slate-100 dark:bg-white/5" />

                                <div className="flex justify-end gap-2.5">
                                    <button
                                        onClick={() =>
                                            setOpenCareerGroup(false)
                                        }
                                        className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-800"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        disabled={!careerGroupName.trim()}
                                        onClick={createCareerGroup}
                                        className="rounded-lg border border-slate-800 bg-slate-800 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:bg-white/10 dark:hover:bg-white/15"
                                    >
                                        Buat Branch
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Modal>

                    {/* Modal: Create Basic Path */}
                    <Modal
                        open={openBasicPath}
                        title="Tambah Path Fundamental"
                        onClose={() => setOpenBasicPath(false)}
                    >
                        <div
                            className="space-y-5"
                            style={{ fontFamily: "'Outfit', sans-serif" }}
                        >
                            <div>
                                <label className="mb-2 block text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase dark:text-slate-500">
                                    Nama Path
                                </label>
                                <input
                                    value={basicPathName}
                                    onChange={(e) =>
                                        setBasicPathName(e.target.value)
                                    }
                                    placeholder="Dasar HTML & CSS"
                                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-slate-400 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500 dark:focus:border-slate-500"
                                    autoFocus
                                />
                            </div>
                            <div className="h-px bg-slate-100 dark:bg-white/5" />
                            <div className="flex justify-end gap-2.5">
                                <button
                                    onClick={() => setOpenBasicPath(false)}
                                    className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-800"
                                >
                                    Batal
                                </button>
                                <button
                                    disabled={!basicPathName.trim()}
                                    onClick={createBasicPath}
                                    className="rounded-lg border border-slate-800 bg-slate-800 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:bg-white/10 dark:hover:bg-white/15"
                                >
                                    Buat Path
                                </button>
                            </div>
                        </div>
                    </Modal>

                    {/* Modal: Create Career Path */}
                    <Modal
                        open={openCareerPath}
                        title="Tambah Path Karir"
                        onClose={() => setOpenCareerPath(false)}
                    >
                        <div
                            className="space-y-5"
                            style={{ fontFamily: "'Outfit', sans-serif" }}
                        >
                            <div>
                                <label className="mb-2 block text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase dark:text-slate-500">
                                    Nama Path
                                </label>
                                <input
                                    value={careerPathName}
                                    onChange={(e) =>
                                        setCareerPathName(e.target.value)
                                    }
                                    placeholder="React.js Lanjutan"
                                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-slate-400 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500 dark:focus:border-slate-500"
                                    autoFocus
                                />
                            </div>
                            <div className="h-px bg-slate-100 dark:bg-slate-800" />
                            <div className="flex justify-end gap-2.5">
                                <button
                                    onClick={() => setOpenCareerPath(false)}
                                    className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-800"
                                >
                                    Batal
                                </button>
                                <button
                                    disabled={!careerPathName.trim()}
                                    onClick={createCareerPath}
                                    className="rounded-lg border border-slate-800 bg-slate-800 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40 dark:border-indigo-500/50 dark:bg-indigo-600 dark:hover:bg-indigo-500"
                                >
                                    Buat Path
                                </button>
                            </div>
                        </div>
                    </Modal>

                    {/* Modal: Assign Mentor to Path */}
                    <Modal
                        open={openAssignMentor}
                        title="Atur Mentor Career Branch"
                        onClose={() => setOpenAssignMentor(false)}
                    >
                        <div
                            className="space-y-5"
                            style={{ fontFamily: "'Outfit', sans-serif" }}
                        >
                            <div>
                                <label className="mb-2 block text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase dark:text-slate-500">
                                    Pilih Mentor
                                </label>
                                <select
                                    value={assignedMentorId}
                                    onChange={(e) =>
                                        setAssignedMentorId(e.target.value)
                                    }
                                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:border-slate-400 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-slate-500"
                                >
                                    <option value="">
                                        Tanpa Mentor (Hapus Mentor)
                                    </option>
                                    {mentors.map((mentor) => (
                                        <option
                                            key={mentor._id}
                                            value={mentor._id}
                                        >
                                            {mentor.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="h-px bg-slate-100 dark:bg-white/5" />
                            <div className="flex justify-end gap-2.5">
                                <button
                                    onClick={() => setOpenAssignMentor(false)}
                                    className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-800"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={submitMentorAssignment}
                                    className="dark:bg-indigo-650 rounded-lg border border-slate-800 bg-slate-800 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-slate-700 dark:border-indigo-500/50 dark:hover:bg-indigo-500"
                                >
                                    Simpan Perubahan
                                </button>
                            </div>
                        </div>
                    </Modal>
                </div>
            </div>
        </AppLayout>
    );
}
