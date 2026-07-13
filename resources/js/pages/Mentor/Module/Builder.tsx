import React, { useState, useCallback, useEffect } from 'react';
import { router, Link } from '@inertiajs/react';
import {
    ChevronDown,
    Plus,
    Layers,
    Trash2,
    GripVertical,
    Type,
    Image as ImageIcon,
    Video,
    FileText,
    Youtube,
    X,
    Check,
    ArrowLeft,
} from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import ConfirmModal from '@/components/ui/ConfirmModal';

import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';

import {
    SortableContext,
    verticalListSortingStrategy,
    useSortable,
    arrayMove,
} from '@dnd-kit/sortable';

import { CSS } from '@dnd-kit/utilities';

/* ================= TYPES ================= */
type ContentType = 'text' | 'image' | 'video' | 'file' | 'youtube';

type ModuleContent = {
    _id?: any;
    id?: string;
    type: ContentType;
    order?: number;
    content: {
        title?: string;
        description?: string;
        url?: string;
    };
};

type Module = {
    _id?: any;
    id?: string;
    slug: string;
    title: string;
    contents: ModuleContent[];
};

type Path = {
    id?: string;
    _id?: any;
    name: string;
    description?: string;

    quiz?: {
        id: string;
    } | null;

    modules: Module[];
};

type CareerGroup = {
    id: string;
    name: string;
};

/* ================= ID ================= */
const getId = (data: any): string => {
    if (!data) return '';
    if (typeof data._id === 'object' && data._id?.$oid) return data._id.$oid;
    return String(data._id || data.id);
};
const getYoutubeEmbed = (url: string) => {
    try {
        const parsed = new URL(url);

        if (parsed.hostname.includes('youtu.be')) {
            return `https://www.youtube.com/embed/${parsed.pathname.slice(1)}`;
        }

        return `https://www.youtube.com/embed/${parsed.searchParams.get('v')}`;
    } catch {
        return '';
    }
};

/* ================= ICONS & COLORS ================= */
const typeIcons = {
    text: <Type size={14} className="text-blue-400" />,
    image: <ImageIcon size={14} className="text-emerald-400" />,
    video: <Video size={14} className="text-purple-400" />,
    file: <FileText size={14} className="text-amber-400" />,
    youtube: <Youtube size={14} className="text-red-500" />,
};

const typeColors = {
    text: 'bg-blue-50/80 text-blue-600 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20',
    image: 'bg-emerald-50/80 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
    video: 'bg-purple-50/80 text-purple-600 border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20',
    file: 'bg-amber-50/80 text-amber-600 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',
    youtube:
        'bg-red-50/80 text-red-600 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20',
};

/* ================= ITEM ================= */
const SortableContent = ({
    content,
    moduleId,
    editingId,
    setEditingId,
    updateContentLocal,
    saveContent,
    deleteContent,
}: any) => {
    const id = getId(content);
    const isEditing = editingId === id;

    // LOCAL STATE FOR FORM (to prevent input lag caused by re-rendering the whole page on every keystroke)
    const [localTitle, setLocalTitle] = useState(content.content?.title || '');
    const [localDesc, setLocalDesc] = useState(
        content.content?.description || '',
    );
    const [localUrl, setLocalUrl] = useState(content.content?.url || '');

    // Sync local state when entering edit mode
    useEffect(() => {
        if (isEditing) {
            setLocalTitle(content.content?.title || '');
            setLocalDesc(content.content?.description || '');
            setLocalUrl(content.content?.url || '');
        }
    }, [isEditing, content.content]);

    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`group flex gap-3 rounded-xl border bg-white p-3 backdrop-blur-sm transition-all duration-200 sm:p-4 dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910] ${isEditing ? 'border-indigo-500 shadow-md shadow-indigo-500/10' : 'border-slate-200/80 shadow-xs shadow-slate-100/50 hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-slate-50 hover:shadow-sm dark:border-slate-800 dark:hover:border-indigo-500/50 dark:hover:bg-slate-900/30'}`}
        >
            {/* DRAG */}
            <div
                {...listeners}
                {...attributes}
                className="flex cursor-grab touch-none flex-col items-center justify-start pt-1 text-slate-400 transition-colors hover:text-indigo-500 dark:hover:text-indigo-400"
            >
                <GripVertical size={20} />
            </div>

            <div className="min-w-0 flex-1">
                {isEditing ? (
                    <div className="flex flex-col gap-4">
                        <div className="space-y-4">
                            <div>
                                <label className="mb-1.5 ml-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">
                                    Content Title
                                </label>
                                <input
                                    value={localTitle}
                                    onChange={(e) =>
                                        setLocalTitle(e.target.value)
                                    }
                                    placeholder="Enter title..."
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 transition-all outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-100 dark:placeholder:text-slate-600"
                                />
                            </div>

                            {content.type === 'text' && (
                                <div>
                                    <label className="mb-1.5 ml-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">
                                        Description / Text Content
                                    </label>
                                    <textarea
                                        value={localDesc}
                                        onChange={(e) =>
                                            setLocalDesc(e.target.value)
                                        }
                                        placeholder="Write your content here..."
                                        className="min-h-[120px] w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-relaxed text-slate-900 transition-all outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-100 dark:placeholder:text-slate-600"
                                        rows={4}
                                    />
                                </div>
                            )}

                            {content.type === 'youtube' && (
                                <div>
                                    <label className="mb-1.5 ml-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">
                                        YouTube URL
                                    </label>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                                            <Youtube
                                                size={16}
                                                className="text-slate-400 dark:text-slate-500"
                                            />
                                        </div>
                                        <input
                                            value={localUrl}
                                            onChange={(e) =>
                                                setLocalUrl(e.target.value)
                                            }
                                            placeholder="https://youtube.com/watch?v=..."
                                            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pr-4 pl-10 text-sm text-slate-900 transition-all outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-100 dark:placeholder:text-slate-600"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="mt-2 flex flex-col items-stretch justify-between gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center dark:border-slate-800">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteContent(id, moduleId);
                                }}
                                className="dark:text-rose-455 flex items-center justify-center gap-1.5 rounded-lg border border-rose-200 px-3 py-2 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-600 hover:text-white sm:py-1.5 dark:border-rose-500/20 dark:hover:bg-rose-600 dark:hover:text-white"
                            >
                                <Trash2
                                    size={16}
                                    className="sm:h-3.5 sm:w-3.5"
                                />
                                Delete Content
                            </button>

                            <div className="flex w-full items-center gap-2 sm:w-auto">
                                <button
                                    onClick={() => setEditingId(null)}
                                    className="text-slate-550 hover:text-slate-850 flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium transition-colors hover:bg-slate-100 sm:flex-none sm:py-1.5 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                                >
                                    <X
                                        size={16}
                                        className="sm:h-3.5 sm:w-3.5"
                                    />
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        const newContent = {
                                            ...content,
                                            content: {
                                                ...content.content,
                                                title: localTitle,
                                                description: localDesc,
                                                url: localUrl,
                                            },
                                        };
                                        updateContentLocal(
                                            moduleId,
                                            id,
                                            'title',
                                            localTitle,
                                        );
                                        updateContentLocal(
                                            moduleId,
                                            id,
                                            'description',
                                            localDesc,
                                        );
                                        updateContentLocal(
                                            moduleId,
                                            id,
                                            'url',
                                            localUrl,
                                        );
                                        saveContent(newContent);
                                        setEditingId(null);
                                    }}
                                    className="bg-indigo-650 flex flex-1 items-center justify-center gap-1.5 rounded-lg px-5 py-2 text-sm font-medium text-white shadow-lg shadow-indigo-500/20 transition-colors hover:bg-indigo-600 sm:flex-none sm:py-1.5"
                                >
                                    <Check
                                        size={16}
                                        className="sm:h-3.5 sm:w-3.5"
                                    />
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div
                        onClick={() => setEditingId(id)}
                        className="relative -m-2 w-full min-w-0 cursor-pointer rounded-xl p-2 pr-8 transition-colors group-hover:bg-slate-50/50 sm:-m-3 sm:p-3 dark:group-hover:bg-slate-800/30"
                    >
                        <div className="mb-2 flex items-center gap-2.5 sm:mb-3">
                            <span
                                className={`flex shrink-0 items-center gap-1.5 rounded-md border px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase sm:text-xs ${typeColors[content.type as keyof typeof typeColors] || 'dark:bg-slate-750 dark:border-slate-655 border-slate-200 bg-slate-100 text-slate-700 dark:text-slate-300'}`}
                            >
                                {
                                    typeIcons[
                                        content.type as keyof typeof typeIcons
                                    ]
                                }
                                {content.type || 'unknown'}
                            </span>
                            <h3 className="group-hover:text-indigo-650 line-clamp-1 text-sm font-semibold break-all text-slate-800 transition-colors sm:text-base dark:text-white dark:group-hover:text-indigo-400">
                                {content.content?.title || 'Untitled Content'}
                            </h3>
                        </div>

                        {/* PREVIEW WRAPPER */}
                        <div className="mt-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shadow-inner sm:mt-3 dark:border-slate-800/80 dark:bg-slate-950/40">
                            {/* TEXT PREVIEW */}
                            {content.type === 'text' &&
                                content.content?.description && (
                                    <div className="w-full overflow-hidden p-4 sm:p-5">
                                        <p
                                            className="text-sm break-words whitespace-pre-wrap text-slate-700 sm:text-base dark:text-slate-300"
                                            style={{ wordBreak: 'break-word' }}
                                        >
                                            {content.content.description}
                                        </p>
                                    </div>
                                )}

                            {/* IMAGE PREVIEW */}
                            {content.type === 'image' &&
                                content.content?.url && (
                                    <div className="group/img relative flex justify-center bg-black/60 p-2 sm:p-4">
                                        <img
                                            src={content.content.url}
                                            className="h-auto max-h-[300px] max-w-full rounded-lg object-contain transition duration-500 group-hover/img:scale-[1.02] sm:max-h-[400px]"
                                            alt={
                                                content.content?.title ||
                                                'Image content'
                                            }
                                        />
                                        <div className="pointer-events-none absolute inset-0 bg-slate-900/0 transition-colors group-hover/img:bg-slate-900/10"></div>
                                    </div>
                                )}

                            {/* VIDEO PREVIEW */}
                            {content.type === 'video' &&
                                content.content?.url && (
                                    <div className="flex justify-center bg-black/80 p-2 sm:p-4">
                                        <video
                                            src={content.content.url}
                                            controls
                                            className="h-auto max-h-[300px] w-auto max-w-full rounded-lg shadow-lg outline-none sm:max-h-[400px]"
                                        />
                                    </div>
                                )}

                            {/* YOUTUBE PREVIEW */}
                            {content.type === 'youtube' &&
                                content.content?.url && (
                                    <div className="w-full bg-black">
                                        <div className="mx-auto aspect-video max-w-4xl">
                                            <iframe
                                                src={getYoutubeEmbed(
                                                    content.content.url,
                                                )}
                                                className="h-full w-full"
                                                allowFullScreen
                                            />
                                        </div>
                                        <div className="flex items-center gap-2 border-t border-slate-800 bg-slate-900/80 px-4 py-2">
                                            <Youtube
                                                size={14}
                                                className="shrink-0 text-red-500"
                                            />
                                            <a
                                                href={content.content.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="truncate text-xs text-slate-400 hover:text-blue-400 hover:underline"
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }
                                            >
                                                {content.content.url}
                                            </a>
                                        </div>
                                    </div>
                                )}

                            {/* PDF PREVIEW */}
                            {content.type === 'file' &&
                                content.content?.url?.endsWith('.pdf') && (
                                    <div className="h-[300px] bg-slate-900/50 sm:h-[450px]">
                                        <iframe
                                            src={content.content.url}
                                            className="h-full w-full"
                                        />
                                    </div>
                                )}

                            {/* OTHER FILE PREVIEW */}
                            {content.type === 'file' &&
                                content.content?.url &&
                                !content.content.url.endsWith('.pdf') && (
                                    <div className="flex items-center justify-center bg-slate-900/30 p-4 sm:p-6">
                                        <a
                                            href={content.content.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="group/link flex flex-col items-center gap-3 text-indigo-400 hover:text-indigo-300"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <div className="rounded-2xl bg-indigo-500/10 p-4 transition-all duration-300 group-hover/link:scale-110 group-hover/link:bg-indigo-500/20">
                                                <FileText size={32} />
                                            </div>
                                            <span className="text-sm font-medium hover:underline">
                                                Download Attached File
                                            </span>
                                        </a>
                                    </div>
                                )}
                        </div>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                deleteContent(id, moduleId);
                            }}
                            className="absolute top-2 right-2 rounded-lg p-2 text-rose-500 opacity-0 transition-all duration-200 group-hover:opacity-100 hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400"
                            title="Delete Content"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

/* ================= MAIN ================= */
export default function ModuleBuilder({
    path,
    group,
}: {
    group: CareerGroup;
    path: Path;
}) {
    const [modules, setModules] = useState<Module[]>(path.modules);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [openModule, setOpenModule] = useState<string | null>(null);
    const [newTitle, setNewTitle] = useState('');

    // Inline state for YouTube input
    const [activeYoutubeModule, setActiveYoutubeModule] = useState<
        string | null
    >(null);
    const [youtubeUrl, setYoutubeUrl] = useState('');
    const [confirmModal, setConfirmModal] = useState<{
        open: boolean;
        title: string;
        message: string;
        confirmText: string;
        variant: 'danger' | 'info' | 'primary';
        onConfirm: () => void;
    }>({
        open: false,
        title: '',
        message: '',
        confirmText: 'Confirm',
        variant: 'danger',
        onConfirm: () => {},
    });

    const rollback = (module: Module, tempId: string) => {
        setModules((prev) =>
            prev.map((m) => {
                if (getId(m) !== getId(module)) return m;

                return {
                    ...m,
                    contents: m.contents.filter((c) => getId(c) !== tempId),
                };
            }),
        );
    };

    // Sync local state when `path` prop updates from backend (e.g. after adding content)
    useEffect(() => {
        setModules(path.modules);
    }, [path]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 5 },
        }),
    );

    const createModule = () => {
        if (!newTitle.trim()) return;

        router.post(
            '/mentor/modules',
            {
                title: newTitle,
                path_id: getId(path),
            },
            {
                onSuccess: () => {
                    setNewTitle('');
                    router.reload();
                },
            },
        );
    };

    const submitYoutube = (module: Module) => {
        if (!youtubeUrl.trim()) return;

        const tempId = 'temp-' + Date.now();
        const type = 'youtube';

        setModules((prev) =>
            prev.map((m) => {
                if (getId(m) !== getId(module)) return m;

                return {
                    ...m,
                    contents: [
                        ...m.contents,
                        {
                            _id: tempId,
                            type,
                            order: m.contents.length + 1,
                            content: { url: youtubeUrl },
                        },
                    ],
                };
            }),
        );

        router.post(
            `/mentor/modules/${getId(module)}/contents`,
            {
                type,
                url: youtubeUrl,
            },
            {
                preserveScroll: true,
                onSuccess: () => router.reload({ only: ['path'] }),
                onError: () => rollback(module, tempId),
            },
        );

        setActiveYoutubeModule(null);
        setYoutubeUrl('');
    };

    const renderAddButtons = (
        moduleId: string,
        module: Module,
        isCentered = false,
    ) => {
        return activeYoutubeModule === moduleId ? (
            <div
                className={`flex w-full animate-in flex-col gap-3 rounded-xl border border-red-500/30 bg-slate-100/50 p-4 shadow-inner duration-200 zoom-in-95 fade-in sm:flex-row dark:bg-slate-900/80 ${isCentered ? 'mx-auto max-w-xl' : ''}`}
            >
                <div className="relative flex-1">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                        <Youtube size={16} className="text-red-500" />
                    </div>
                    <input
                        autoFocus
                        value={youtubeUrl}
                        onChange={(e) => setYoutubeUrl(e.target.value)}
                        placeholder="Paste YouTube URL here (https://...)"
                        className="dark:border-slate-750 w-full rounded-lg border border-slate-200 bg-white py-2.5 pr-4 pl-10 text-sm text-slate-900 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 dark:bg-slate-950/80 dark:text-white"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') submitYoutube(module);
                            if (e.key === 'Escape')
                                setActiveYoutubeModule(null);
                        }}
                    />
                </div>
                <div className="flex w-full items-center gap-2 sm:w-auto">
                    <button
                        onClick={() => setActiveYoutubeModule(null)}
                        className="dark:hover:bg-slate-850 flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-500 transition-colors hover:text-slate-800 sm:flex-none sm:border-transparent dark:border-slate-700 dark:text-slate-400 dark:hover:text-white"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => submitYoutube(module)}
                        className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-red-500/20 transition-colors hover:bg-red-500 sm:flex-none"
                    >
                        Add Video
                    </button>
                </div>
            </div>
        ) : (
            <div
                className={`grid w-full grid-cols-2 gap-2.5 sm:flex sm:flex-wrap ${isCentered ? 'justify-center' : ''}`}
            >
                {[
                    {
                        type: 'text',
                        icon: Type,
                        color: 'hover:border-blue-500/50 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-500/5 dark:hover:bg-blue-500/10 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80',
                    },
                    {
                        type: 'image',
                        icon: ImageIcon,
                        color: 'hover:border-emerald-500/50 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-500/5 dark:hover:bg-emerald-500/10 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80',
                    },
                    {
                        type: 'video',
                        icon: Video,
                        color: 'hover:border-purple-500/50 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-500/5 dark:hover:bg-purple-500/10 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80',
                    },
                    {
                        type: 'file',
                        icon: FileText,
                        color: 'hover:border-amber-500/50 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-500/5 dark:hover:bg-amber-500/10 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80',
                    },
                    {
                        type: 'youtube',
                        icon: Youtube,
                        color: 'hover:border-red-500/50 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-500/5 dark:hover:bg-red-500/10 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80',
                    },
                ].map(({ type, icon: Icon, color }) => (
                    <button
                        key={type}
                        onClick={() => {
                            if (type === 'youtube') {
                                setActiveYoutubeModule(moduleId);
                                setYoutubeUrl('');
                            } else {
                                addContent(module, type as ContentType);
                            }
                        }}
                        className={`flex min-w-[100px] flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-medium text-slate-700 transition-all duration-200 dark:text-slate-300 ${color} shadow-sm`}
                    >
                        <Icon size={16} className="opacity-80" />
                        <span className="capitalize">{type}</span>
                    </button>
                ))}
            </div>
        );
    };

    const addContent = (module: Module, type: ContentType) => {
        const tempId = 'temp-' + Date.now();

        // ================= TEXT =================
        if (type === 'text') {
            setModules((prev) =>
                prev.map((m) => {
                    if (getId(m) !== getId(module)) return m;

                    return {
                        ...m,
                        contents: [
                            ...m.contents,
                            {
                                _id: tempId,
                                type,
                                order: m.contents.length + 1,
                                content: {},
                            },
                        ],
                    };
                }),
            );

            router.post(
                `/mentor/modules/${getId(module)}/contents`,
                { type },
                {
                    preserveScroll: true,
                    onSuccess: () => router.reload({ only: ['path'] }),
                    onError: () => rollback(module, tempId),
                },
            );

            return;
        }

        // ================= FILE BASED =================
        const input = document.createElement('input');
        input.type = 'file';

        if (type === 'image') input.accept = 'image/*';
        if (type === 'video') input.accept = 'video/*';

        input.onchange = () => {
            const file = input.files?.[0];
            if (!file) return;

            // optimistic UI
            setModules((prev) =>
                prev.map((m) => {
                    if (getId(m) !== getId(module)) return m;

                    return {
                        ...m,
                        contents: [
                            ...m.contents,
                            {
                                _id: tempId,
                                type,
                                order: m.contents.length + 1,
                                content: {
                                    url: URL.createObjectURL(file),
                                },
                            },
                        ],
                    };
                }),
            );

            const formData = new FormData();
            formData.append('type', type);
            formData.append('file', file);

            router.post(`/mentor/modules/${getId(module)}/contents`, formData, {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: () => router.reload({ only: ['path'] }),
                onError: () => rollback(module, tempId),
            });
        };

        input.click();
    };

    const deleteContent = (id: string, moduleId: string) => {
        setConfirmModal({
            open: true,
            title: 'Hapus Blok Konten',
            message:
                'Apakah Anda yakin ingin menghapus blok konten ini dari modul? Tindakan ini tidak dapat dibatalkan.',
            confirmText: 'Hapus Konten',
            variant: 'danger',
            onConfirm: () => {
                setModules((prev) =>
                    prev.map((m) =>
                        getId(m) === moduleId
                            ? {
                                  ...m,
                                  contents: m.contents.filter(
                                      (c) => getId(c) !== id,
                                  ),
                              }
                            : m,
                    ),
                );
                router.delete(`/mentor/module-contents/${id}`, {
                    preserveScroll: true,
                });
            },
        });
    };

    const deleteModule = (module: Module) => {
        const moduleId = getId(module);
        setConfirmModal({
            open: true,
            title: 'Hapus Modul',
            message: `Apakah Anda yakin ingin menghapus modul "${module.title}" beserta seluruh konten di dalamnya?`,
            confirmText: 'Hapus Modul',
            variant: 'danger',
            onConfirm: () => {
                router.delete(`/mentor/modules/${moduleId}`, {
                    preserveScroll: true,
                    onSuccess: () => router.reload({ only: ['path'] }),
                });
            },
        });
    };

    const deleteQuiz = (quizId: string) => {
        setConfirmModal({
            open: true,
            title: 'Hapus Final Quiz',
            message:
                'Apakah Anda yakin ingin menghapus Final Quiz untuk path ini beserta seluruh pertanyaan di dalamnya?',
            confirmText: 'Hapus Quiz',
            variant: 'danger',
            onConfirm: () => {
                router.delete(`/mentor/quiz/${quizId}`, {
                    preserveScroll: true,
                    onSuccess: () => router.reload({ only: ['path'] }),
                });
            },
        });
    };

    const updateContentLocal = useCallback(
        (
            moduleId: string,
            contentId: string,
            key: keyof ModuleContent['content'],
            value: string,
        ) => {
            setModules((prev) =>
                prev.map((m) => {
                    if (getId(m) !== moduleId) return m;

                    return {
                        ...m,
                        contents: m.contents.map((c) =>
                            getId(c) === contentId
                                ? {
                                      ...c,
                                      content: { ...c.content, [key]: value },
                                  }
                                : c,
                        ),
                    };
                }),
            );
        },
        [],
    );

    const saveContent = (content: ModuleContent) => {
        router.put(
            `/mentor/module-contents/${getId(content)}`,
            {
                title: content.content?.title,
                description: content.content?.description,
                url: content.content?.url,
            },
            {
                preserveScroll: true,
            },
        );
    };

    const handleDragEnd = (event: any, module: Module) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = module.contents.findIndex(
            (c) => getId(c) === active.id,
        );
        const newIndex = module.contents.findIndex((c) => getId(c) === over.id);

        if (oldIndex === -1 || newIndex === -1) return;

        const newContents = arrayMove(module.contents, oldIndex, newIndex);

        setModules((prev) =>
            prev.map((m) =>
                getId(m) === getId(module)
                    ? { ...m, contents: newContents }
                    : m,
            ),
        );

        router.put('/mentor/module-contents/reorder', {
            contents: newContents.map((c, i) => ({
                id: getId(c),
                order: i + 1,
            })),
        });
    };

    return (
        <AppLayout>
            <div
                className="mx-auto w-full space-y-6 p-4 sm:space-y-8 sm:p-6 lg:p-8"
                style={{ fontFamily: "'Outfit', sans-serif" }}
            >
                {/* HEADER */}
                <div className="relative overflow-hidden rounded-xl border border-slate-200/80 p-6 shadow-sm shadow-slate-100/50 dark:border-slate-800">
                    <div className="absolute inset-0 bg-white dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]" />
                    <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700" />

                    <div className="relative z-10 flex w-full flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                        <div>
                            <div className="flex items-center gap-3">
                                <Link
                                    href={`/mentor/career-groups/${group.id}/paths`}
                                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition-all hover:border-indigo-300 hover:bg-slate-50 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-indigo-500/50 dark:hover:bg-slate-700 dark:hover:text-indigo-400"
                                >
                                    <ArrowLeft size={18} />
                                </Link>

                                <h1 className="flex items-center gap-3 text-2xl font-bold text-slate-800 sm:text-3xl dark:text-white">
                                    <div className="rounded-lg bg-indigo-500/10 p-2">
                                        <Layers
                                            className="text-indigo-500"
                                            size={24}
                                        />
                                    </div>
                                    Module Builder
                                </h1>
                            </div>

                            <div className="mt-2 ml-14 flex items-center gap-2">
                                <span className="text-sm text-slate-400 dark:text-slate-500">
                                    Path:
                                </span>

                                <span className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700 shadow-inner dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                    {path.name}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => {
                                    if (path.quiz?.id) {
                                        router.get(
                                            `/mentor/quiz/${path.quiz.id}/edit`,
                                        );
                                    } else {
                                        router.get(
                                            `/mentor/career-groups/${group.id}/paths/${getId(path)}/quiz/create`,
                                        );
                                    }
                                }}
                                className="group flex cursor-pointer items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-5 py-2.5 text-sm font-medium text-white shadow-md transition-all hover:-translate-y-0.5 hover:from-purple-500 hover:to-pink-500 hover:shadow-lg"
                            >
                                <span>🎯 Manage Final Quiz</span>
                            </button>
                            {path.quiz?.id && (
                                <button
                                    type="button"
                                    onClick={() => deleteQuiz(path.quiz!.id)}
                                    className="cursor-pointer rounded-xl border border-rose-500/20 bg-rose-500/10 p-2.5 text-rose-500 transition-colors hover:bg-rose-500/20"
                                    title="Delete Final Quiz"
                                >
                                    <Trash2 size={18} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* CREATE MODULE */}
                <div className="relative overflow-hidden rounded-xl border border-slate-200/80 p-5 shadow-sm shadow-slate-100/50 dark:border-slate-800">
                    <div className="absolute inset-0 bg-white dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]" />
                    <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700" />

                    <div className="relative z-10 flex w-full flex-col items-center gap-4 sm:flex-row">
                        <div className="relative w-full flex-1">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                <Layers
                                    size={18}
                                    className="text-slate-400 dark:text-slate-500"
                                />
                            </div>
                            <input
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                onKeyDown={(e) =>
                                    e.key === 'Enter' && createModule()
                                }
                                placeholder="Enter new module title..."
                                className="dark:placeholder:text-slate-655 w-full rounded-xl border border-slate-200 bg-white py-3 pr-4 pl-11 text-sm text-slate-900 transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-100"
                            />
                        </div>
                        <button
                            onClick={createModule}
                            disabled={!newTitle.trim()}
                            className="bg-indigo-650 flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-medium text-white shadow-md shadow-indigo-500/20 transition-all hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                        >
                            <Plus size={18} /> Add Module
                        </button>
                    </div>
                </div>

                {/* MODULES LIST */}
                <div className="space-y-4">
                    {modules.map((module) => {
                        const moduleId = getId(module);
                        const isOpen = openModule === moduleId;

                        return (
                            <div
                                key={moduleId}
                                className="relative overflow-hidden rounded-xl border border-slate-200/80 shadow-sm shadow-slate-100/50 transition-all duration-300 dark:border-slate-800"
                            >
                                <div className="absolute inset-0 bg-white dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]" />
                                <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700" />

                                <div
                                    onClick={() =>
                                        setOpenModule(isOpen ? null : moduleId)
                                    }
                                    className={`relative z-10 flex cursor-pointer items-center justify-between p-5 transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-900/30 ${isOpen ? 'border-b border-slate-200 bg-slate-50/20 dark:border-slate-800/80 dark:bg-slate-950/10' : ''}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div
                                            className={`rounded-lg p-2 transition-colors ${isOpen ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`}
                                        >
                                            <Layers size={20} />
                                        </div>
                                        <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
                                            {module.title}
                                        </h2>
                                        <span className="rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
                                            {module.contents.length} items
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deleteModule(module);
                                            }}
                                            className="cursor-pointer rounded-lg p-2 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-500/10"
                                            title="Delete Module"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                        <div
                                            className={`rounded-full p-2 transition-all duration-300 ${isOpen ? 'rotate-180 bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-white' : 'text-slate-400 dark:text-slate-500'}`}
                                        >
                                            <ChevronDown size={20} />
                                        </div>
                                    </div>
                                </div>

                                {isOpen && (
                                    <div className="relative z-10 flex flex-col gap-5 bg-slate-50/30 p-5 dark:bg-slate-950/30">
                                        <div className="space-y-4">
                                            <DndContext
                                                sensors={sensors}
                                                collisionDetection={
                                                    closestCenter
                                                }
                                                onDragEnd={(e) =>
                                                    handleDragEnd(e, module)
                                                }
                                            >
                                                <SortableContext
                                                    items={module.contents.map(
                                                        (c) => getId(c),
                                                    )}
                                                    strategy={
                                                        verticalListSortingStrategy
                                                    }
                                                >
                                                    <div className="flex flex-col gap-4">
                                                        {module.contents.map(
                                                            (c) => (
                                                                <SortableContent
                                                                    key={getId(
                                                                        c,
                                                                    )}
                                                                    content={c}
                                                                    moduleId={
                                                                        moduleId
                                                                    }
                                                                    editingId={
                                                                        editingId
                                                                    }
                                                                    setEditingId={
                                                                        setEditingId
                                                                    }
                                                                    updateContentLocal={
                                                                        updateContentLocal
                                                                    }
                                                                    saveContent={
                                                                        saveContent
                                                                    }
                                                                    deleteContent={
                                                                        deleteContent
                                                                    }
                                                                />
                                                            ),
                                                        )}
                                                    </div>
                                                </SortableContext>
                                            </DndContext>

                                            {module.contents.length === 0 && (
                                                <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-8 text-center sm:p-12 dark:border-slate-800/60 dark:bg-slate-900/20">
                                                    <Layers
                                                        size={40}
                                                        className="mb-4 text-slate-400 opacity-50 dark:text-slate-600"
                                                    />
                                                    <p className="text-slate-750 dark:text-slate-350 mb-1 font-medium">
                                                        No content in this
                                                        module yet.
                                                    </p>
                                                    <p className="mb-8 text-sm text-slate-500 dark:text-slate-400/60">
                                                        Add your first content
                                                        block to get started.
                                                    </p>

                                                    <div className="w-full max-w-3xl">
                                                        {renderAddButtons(
                                                            moduleId,
                                                            module,
                                                            true,
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {module.contents.length > 0 && (
                                            <div className="mt-4 flex flex-col gap-3 border-t border-slate-200 pt-5 dark:border-slate-800/80">
                                                <span className="pl-1 text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                                                    Add Content Block
                                                </span>
                                                {renderAddButtons(
                                                    moduleId,
                                                    module,
                                                    false,
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {modules.length === 0 && (
                        <div className="rounded-xl border-2 border-dashed border-slate-200 bg-white py-20 text-center shadow-sm shadow-slate-100/50 dark:border-slate-800/60 dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]">
                            <Layers
                                className="mx-auto mb-4 text-slate-400 dark:text-slate-500"
                                size={48}
                            />
                            <h3 className="mb-1 text-lg font-semibold text-slate-800 dark:text-white">
                                No Modules Created
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400/60">
                                Start building your learning path by creating a
                                module above.
                            </p>
                        </div>
                    )}
                </div>
            </div>
            <ConfirmModal
                open={confirmModal.open}
                onClose={() =>
                    setConfirmModal((prev) => ({ ...prev, open: false }))
                }
                onConfirm={confirmModal.onConfirm}
                title={confirmModal.title}
                message={confirmModal.message}
                confirmText={confirmModal.confirmText}
                variant={confirmModal.variant}
            />
        </AppLayout>
    );
}
