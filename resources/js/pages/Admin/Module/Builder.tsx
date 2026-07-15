import React, { useState, useCallback, useEffect } from 'react';
import { router } from '@inertiajs/react';
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
    _id?: any;
    id?: string;
    name: string;
    modules: Module[];
    quiz?: {
        id: string;
        _id?: string;
    } | null;
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
    text: <Type size={14} className="text-blue-500 dark:text-blue-400" />,
    image: (
        <ImageIcon
            size={14}
            className="text-emerald-500 dark:text-emerald-400"
        />
    ),
    video: <Video size={14} className="text-purple-500 dark:text-purple-400" />,
    file: <FileText size={14} className="text-amber-500 dark:text-amber-400" />,
    youtube: <Youtube size={14} className="text-red-500" />,
};

const typeColors = {
    text: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/50',
    image: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50',
    video: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-900/50',
    file: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/50',
    youtube:
        'bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/50',
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
            className={`group flex gap-3 rounded-xl border bg-white p-3 backdrop-blur-sm transition-all duration-200 sm:p-4 dark:bg-[#060B1A]/80 ${isEditing ? 'border-[#3B28F6] shadow-lg shadow-[#3B28F6]/5 dark:border-[#7C5CFF]' : 'hover:border-slate-350 border-slate-200 hover:bg-slate-50 dark:border-slate-800/80 dark:hover:border-slate-700 dark:hover:bg-slate-800/30'}`}
        >
            {/* DRAG */}
            <div
                {...listeners}
                {...attributes}
                className="flex cursor-grab touch-none flex-col items-center justify-start pt-1 text-slate-400 transition-colors hover:text-[#3B28F6] dark:hover:text-[#7C5CFF]"
            >
                <GripVertical size={20} />
            </div>

            <div className="min-w-0 flex-1">
                {isEditing ? (
                    <div className="flex flex-col gap-4">
                        <div className="space-y-4">
                            <div>
                                <label className="mb-1.5 ml-1 block text-xs font-bold tracking-[0.15em] text-slate-400 uppercase dark:text-slate-500">
                                    Content Title
                                </label>
                                <input
                                    value={localTitle}
                                    onChange={(e) =>
                                        setLocalTitle(e.target.value)
                                    }
                                    placeholder="Enter title..."
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 transition-all outline-none placeholder:text-slate-400 focus:border-[#3B28F6] focus:ring-1 focus:ring-[#3B28F6] dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600 dark:focus:border-[#7C5CFF] dark:focus:ring-[#7C5CFF]"
                                />
                            </div>

                            {content.type === 'text' && (
                                <div>
                                    <label className="mb-1.5 ml-1 block text-xs font-bold tracking-[0.15em] text-slate-400 uppercase dark:text-slate-500">
                                        Description / Text Content
                                    </label>
                                    <textarea
                                        value={localDesc}
                                        onChange={(e) =>
                                            setLocalDesc(e.target.value)
                                        }
                                        placeholder="Write your content here..."
                                        className="min-h-[120px] w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-relaxed text-slate-900 transition-all outline-none placeholder:text-slate-400 focus:border-[#3B28F6] focus:ring-1 focus:ring-[#3B28F6] dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600 dark:focus:border-[#7C5CFF] dark:focus:ring-[#7C5CFF]"
                                        rows={4}
                                    />
                                </div>
                            )}

                            {content.type === 'youtube' && (
                                <div>
                                    <label className="mb-1.5 ml-1 block text-xs font-bold tracking-[0.15em] text-slate-400 uppercase dark:text-slate-500">
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
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pr-4 pl-10 text-sm text-slate-900 transition-all outline-none placeholder:text-slate-400 focus:border-[#3B28F6] focus:ring-1 focus:ring-[#3B28F6] dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600 dark:focus:border-[#7C5CFF] dark:focus:ring-[#7C5CFF]"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="border-slate-150 mt-2 flex flex-col items-stretch justify-between gap-3 border-t pt-4 sm:flex-row sm:items-center dark:border-slate-800/80">
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteContent(id, moduleId);
                                }}
                                className="flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-rose-200 px-3 py-2 text-sm font-semibold text-rose-500 transition-colors hover:bg-rose-50 hover:text-rose-600 sm:py-1.5 dark:border-transparent dark:hover:bg-rose-500/10"
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
                                    className="dark:hover:bg-slate-800 flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 sm:flex-none sm:border-transparent sm:py-1.5 dark:border-slate-700 dark:text-slate-400 dark:hover:text-white"
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
                                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#3B28F6] px-5 py-2 text-sm font-semibold text-white shadow-md shadow-[#3B28F6]/10 transition-colors hover:bg-[#2a1ce0] sm:flex-none sm:py-1.5"
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
                        className="relative -m-2 w-full min-w-0 cursor-pointer rounded-xl p-2 pr-8 transition-colors group-hover:bg-slate-50/50 sm:-m-3 sm:p-3 dark:group-hover:bg-slate-800/10"
                    >
                        <div className="mb-2 flex items-center gap-2.5 sm:mb-3">
                            <span
                                className={`flex shrink-0 items-center gap-1.5 rounded-md border px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase sm:text-xs ${typeColors[content.type as keyof typeof typeColors] || 'dark:border-slate-750 border-slate-200 bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}
                            >
                                {
                                    typeIcons[
                                        content.type as keyof typeof typeIcons
                                    ]
                                }
                                {content.type || 'unknown'}
                            </span>
                            <h3 className="line-clamp-1 text-sm font-semibold break-all text-slate-800 transition-colors group-hover:text-[#3B28F6] sm:text-base dark:text-white dark:group-hover:text-[#7C5CFF]">
                                {content.content?.title || 'Untitled Content'}
                            </h3>
                        </div>

                        {/* PREVIEW WRAPPER */}
                        <div className="mt-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50/50 shadow-inner sm:mt-3 dark:border-slate-800/80 dark:bg-slate-950/40">
                            {/* TEXT PREVIEW */}
                            {content.type === 'text' &&
                                content.content?.description && (
                                    <div className="w-full overflow-hidden p-4 sm:p-5">
                                        <p
                                            className="dark:text-slate-350 text-sm break-words whitespace-pre-wrap text-slate-700 sm:text-base"
                                            style={{ wordBreak: 'break-word' }}
                                        >
                                            {content.content.description}
                                        </p>
                                    </div>
                                )}

                            {/* IMAGE PREVIEW */}
                            {content.type === 'image' &&
                                content.content?.url && (
                                    <div className="group/img relative flex justify-center bg-black/5 p-2 sm:p-4 dark:bg-black/60">
                                        <img
                                            src={content.content.url}
                                            className="h-auto max-h-[300px] max-w-full rounded-lg object-contain transition duration-500 group-hover/img:scale-[1.02] sm:max-h-[400px]"
                                            alt={
                                                content.content?.title ||
                                                'Image content'
                                            }
                                        />
                                        <div className="pointer-events-none absolute inset-0 bg-slate-900/0 transition-colors group-hover/img:bg-slate-900/5 dark:group-hover/img:bg-slate-900/10"></div>
                                    </div>
                                )}

                            {/* VIDEO PREVIEW */}
                            {content.type === 'video' &&
                                content.content?.url && (
                                    <div className="flex justify-center bg-black/10 p-2 sm:p-4 dark:bg-black/80">
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
                                        <div className="flex items-center gap-2 border-t border-slate-200 bg-slate-100 px-4 py-2 dark:border-slate-800 dark:bg-slate-900/80">
                                            <Youtube
                                                size={14}
                                                className="shrink-0 text-red-500"
                                            />
                                            <a
                                                href={content.content.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="truncate text-xs text-slate-500 hover:text-[#3B28F6] hover:underline dark:text-slate-400 dark:hover:text-[#7C5CFF]"
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
                                    <div className="h-[300px] bg-slate-100 sm:h-[450px] dark:bg-slate-900/50">
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
                                    <div className="flex items-center justify-center bg-slate-50 p-4 sm:p-6 dark:bg-slate-900/30">
                                        <a
                                            href={content.content.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="group/link flex flex-col items-center gap-3 text-[#3B28F6] hover:text-[#2a1ce0] dark:text-[#7C5CFF] dark:hover:text-[#8B5CF6]"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <div className="rounded-2xl bg-[#3B28F6]/10 p-4 transition-all duration-300 group-hover/link:scale-110 group-hover/link:bg-[#3B28F6]/15 dark:bg-[#7C5CFF]/10 dark:group-hover/link:bg-[#7C5CFF]/15">
                                                <FileText size={32} />
                                            </div>
                                            <span className="text-sm font-semibold hover:underline">
                                                Download Attached File
                                            </span>
                                        </a>
                                    </div>
                                )}
                        </div>

                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                deleteContent(id, moduleId);
                            }}
                            className="absolute top-2 right-2 z-20 cursor-pointer rounded-lg p-2 text-rose-500 opacity-0 transition-all duration-200 group-hover:opacity-100 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10"
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
export default function ModuleBuilder({ path }: { path: Path }) {
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
            '/admin/modules',
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
            `/admin/modules/${getId(module)}/contents`,
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
                className={`flex w-full animate-in flex-col gap-3 rounded-xl border border-red-500/30 bg-slate-900/80 p-4 shadow-inner duration-200 zoom-in-95 fade-in sm:flex-row ${isCentered ? 'mx-auto max-w-xl' : ''}`}
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
                        className="w-full rounded-lg border border-slate-700 bg-slate-950/80 py-2.5 pr-4 pl-10 text-sm text-white outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
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
                        className="flex-1 rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-slate-800 hover:text-white sm:flex-none sm:border-transparent"
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
                        color: 'hover:border-blue-500/50 hover:text-blue-400 hover:bg-blue-500/10 border-slate-700/80 bg-slate-900/80',
                    },
                    {
                        type: 'image',
                        icon: ImageIcon,
                        color: 'hover:border-emerald-500/50 hover:text-emerald-400 hover:bg-emerald-500/10 border-slate-700/80 bg-slate-900/80',
                    },
                    {
                        type: 'video',
                        icon: Video,
                        color: 'hover:border-purple-500/50 hover:text-purple-400 hover:bg-purple-500/10 border-slate-700/80 bg-slate-900/80',
                    },
                    {
                        type: 'file',
                        icon: FileText,
                        color: 'hover:border-amber-500/50 hover:text-amber-400 hover:bg-amber-500/10 border-slate-700/80 bg-slate-900/80',
                    },
                    {
                        type: 'youtube',
                        icon: Youtube,
                        color: 'hover:border-red-500/50 hover:text-red-500 hover:bg-red-500/10 border-slate-700/80 bg-slate-900/80',
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
                        className={`flex min-w-[100px] flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-medium text-slate-300 transition-all duration-200 ${color} shadow-sm`}
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
                `/admin/modules/${getId(module)}/contents`,
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

            router.post(`/admin/modules/${getId(module)}/contents`, formData, {
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
                router.delete(`/admin/module-contents/${id}`);
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
                router.delete(`/admin/modules/${moduleId}`, {
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
                router.delete(`/admin/quiz/${quizId}`, {
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
            `/admin/module-contents/${getId(content)}`,
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

        router.put('/admin/module-contents/reorder', {
            contents: newContents.map((c, i) => ({
                id: getId(c),
                order: i + 1,
            })),
        });
    };

    return (
        <AppLayout>
            <div
                className="relative min-h-screen overflow-hidden bg-[#f8fafc] px-4 py-8 text-slate-800 transition-colors duration-200 sm:px-6 lg:px-10 dark:bg-[#030712] dark:text-white"
                style={{ fontFamily: "'Outfit', sans-serif" }}
            >
                {/* Subtle top-center ambient glow (visible on dark mode) */}
                <div className="pointer-events-none absolute top-0 left-1/2 z-0 h-[450px] w-full max-w-7xl -translate-x-1/2 rounded-full bg-indigo-500/5 blur-[120px] select-none dark:bg-indigo-500/5" />

                <div className="relative z-10 mx-auto w-full space-y-6">
                    {/* HEADER */}
                    <header
                        className="relative w-full overflow-hidden rounded-xl border border-slate-200 bg-[#f5f6ff] px-6 py-5 dark:border-white/5 dark:bg-[#0d0f17]"
                        style={{
                            backgroundImage: `
                                linear-gradient(rgba(59,40,246,0.07) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(59,40,246,0.07) 1px, transparent 1px)
                            `,
                            backgroundSize: '40px 40px',
                        }}
                    >
                        {/* Corner brackets */}
                        <span className="absolute top-3.5 left-3.5 h-3 w-3 border-t border-l border-[rgba(59,40,246,0.2)] dark:border-[rgba(59,40,246,0.45)]" />
                        <span className="absolute top-3.5 right-3.5 h-3 w-3 border-t border-r border-[rgba(59,40,246,0.2)] dark:border-[rgba(59,40,246,0.45)]" />
                        <span className="absolute bottom-3.5 left-3.5 h-3 w-3 border-b border-l border-[rgba(59,40,246,0.2)] dark:border-[rgba(59,40,246,0.45)]" />
                        <span className="absolute right-3.5 bottom-3.5 h-3 w-3 border-r border-b border-[rgba(59,40,246,0.2)] dark:border-[rgba(59,40,246,0.45)]" />

                        <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex flex-col gap-2">
                                <button
                                    onClick={() => window.history.back()}
                                    className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-slate-500 uppercase transition-colors hover:text-[#3B28F6] dark:text-slate-400 dark:hover:text-[#7C5CFF]"
                                >
                                    <ArrowLeft size={14} /> Back
                                </button>

                                {/* Badge */}
                                <div className="mt-1 inline-flex w-fit items-center gap-1.5 rounded border border-[rgba(59,40,246,0.2)] bg-[rgba(59,40,246,0.06)] px-2.5 py-1 dark:border-[rgba(59,40,246,0.35)] dark:bg-[rgba(59,40,246,0.1)]">
                                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#3B28F6]" />
                                    <span className="text-[10px] font-bold tracking-[0.12em] text-[#3B28F6] uppercase">
                                        Path Module Builder
                                    </span>
                                </div>

                                {/* Title */}
                                <h1
                                    className="m-0 text-2xl leading-none font-bold tracking-tight text-[#3B28F6] sm:text-3xl dark:text-[#7C5CFF]"
                                    style={{
                                        fontFamily: 'Orbitron, sans-serif',
                                    }}
                                >
                                    Module Builder
                                </h1>

                                {/* Subtitle */}
                                <div className="mt-1 flex items-center gap-2">
                                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                        Path:
                                    </span>
                                    <span className="dark:text-slate-350 rounded border border-slate-200 bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                                        {path.name}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (path.quiz?.id || path.quiz?._id) {
                                            router.get(
                                                `/admin/quiz/${path.quiz.id || path.quiz._id}/edit`,
                                            );
                                        } else {
                                            router.get(
                                                `/admin/paths/${getId(path)}/quiz/create`,
                                            );
                                        }
                                    }}
                                    className="relative flex cursor-pointer items-center gap-3 rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm shadow-slate-200/80 transition-all hover:bg-slate-50 hover:shadow-md hover:shadow-slate-200 active:scale-95 active:shadow-none dark:border-zinc-600 dark:bg-zinc-800 dark:text-neutral-300 dark:shadow-zinc-900 dark:hover:bg-zinc-700 dark:hover:shadow-zinc-900"
                                >
                                    <span className="h-3.5 w-0.5 shrink-0 bg-indigo-500" />
                                    <span>Manage Final Quiz</span>
                                </button>
                                {(path.quiz?.id || path.quiz?._id) && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            deleteQuiz(
                                                (path.quiz!.id ||
                                                    path.quiz!._id)!,
                                            )
                                        }
                                        className="cursor-pointer rounded-lg border border-rose-500/20 bg-rose-500/10 p-2.5 text-rose-500 transition-colors hover:bg-rose-500/20"
                                        title="Delete Final Quiz"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </header>

                    {/* CREATE MODULE */}
                    <div className="relative flex flex-col items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row dark:border-white/8 dark:bg-[#060B1A]/80">
                        {/* Top accent line */}
                        <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent dark:via-slate-800" />

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
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pr-4 pl-11 text-sm text-slate-900 transition-shadow placeholder:text-slate-400 focus:border-[#3B28F6] focus:ring-1 focus:ring-[#3B28F6] focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600 dark:focus:border-[#7C5CFF] dark:focus:ring-[#7C5CFF]"
                            />
                        </div>
                        <button
                            onClick={createModule}
                            disabled={!newTitle.trim()}
                            className="relative flex w-full items-center justify-center gap-3 border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm shadow-slate-200/80 transition-all hover:bg-slate-50 hover:shadow-md hover:shadow-slate-200 active:scale-95 active:shadow-none disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto dark:border-zinc-600 dark:bg-zinc-800 dark:text-neutral-300 dark:shadow-zinc-900 dark:hover:bg-zinc-700 dark:hover:shadow-zinc-900"
                        >
                            <span className="h-3.5 w-0.5 shrink-0 bg-indigo-500" />
                            <span>Add Module</span>
                        </button>
                    </div>

                    {/* MODULES LIST */}
                    <div className="space-y-4">
                        {modules.map((module) => {
                            const moduleId = getId(module);
                            const isOpen = openModule === moduleId;

                            return (
                                <div
                                    key={moduleId}
                                    className="relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 dark:border-white/8 dark:bg-[#060B1A]/80"
                                >
                                    {/* Top accent line */}
                                    <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent dark:via-slate-800" />

                                    <div
                                        onClick={() =>
                                            setOpenModule(
                                                isOpen ? null : moduleId,
                                            )
                                        }
                                        className={`flex cursor-pointer items-center justify-between p-5 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/20 ${isOpen ? 'border-b border-slate-100 bg-slate-50/50 dark:border-white/5 dark:bg-slate-800/10' : ''}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div
                                                className={`rounded-lg p-2 transition-colors ${isOpen ? 'bg-[#3B28F6]/10 text-[#3B28F6] dark:bg-[#7C5CFF]/15 dark:text-[#7C5CFF]' : 'border border-slate-200 bg-slate-100 text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400'}`}
                                            >
                                                <Layers size={20} />
                                            </div>
                                            <h2 className="text-lg font-bold text-slate-800 dark:text-white">
                                                {module.title}
                                            </h2>
                                            <span className="rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
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
                                                className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-500/10"
                                                title="Delete Module"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                            <div
                                                className={`rounded-full p-2 transition-all duration-300 ${isOpen ? 'dark:bg-slate-800 rotate-180 bg-slate-100 text-slate-800 dark:text-white' : 'text-slate-400 dark:text-slate-500'}`}
                                            >
                                                <ChevronDown size={20} />
                                            </div>
                                        </div>
                                    </div>

                                    {isOpen && (
                                        <div className="flex flex-col gap-5 bg-slate-50/10 p-5 dark:bg-slate-950/20">
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
                                                                        content={
                                                                            c
                                                                        }
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

                                                {module.contents.length ===
                                                    0 && (
                                                    <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/30 p-8 text-center sm:p-12 dark:border-slate-800/60 dark:bg-slate-900/10">
                                                        <Layers
                                                            size={40}
                                                            className="mb-4 text-slate-400 opacity-50 dark:text-slate-600"
                                                        />
                                                        <p className="mb-1 font-semibold text-slate-700 dark:text-slate-300">
                                                            No content in this
                                                            module yet.
                                                        </p>
                                                        <p className="mb-8 text-xs text-slate-500 dark:text-slate-500">
                                                            Add your first
                                                            content block to get
                                                            started.
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
                                                    <span className="text-slate-455 pl-1 text-xs font-bold tracking-wider uppercase dark:text-slate-500">
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
                            <div className="rounded-xl border-2 border-dashed border-slate-200 bg-white py-20 text-center shadow-sm dark:border-slate-800/60 dark:bg-[#060B1A]/80">
                                <Layers
                                    className="mx-auto mb-4 text-slate-400 dark:text-slate-600"
                                    size={48}
                                />
                                <h3 className="mb-1 text-lg font-semibold text-slate-700 dark:text-white">
                                    No Modules Created
                                </h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    Start building your learning path by
                                    creating a module above.
                                </p>
                            </div>
                        )}
                    </div>
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
