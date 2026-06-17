import React, { useState, useCallback, useEffect } from "react";
import { router } from "@inertiajs/react";
import { ChevronDown, Plus, Layers, Trash2, GripVertical, Type, Image as ImageIcon, Video, FileText, Youtube, X, Check, ArrowLeft } from "lucide-react";
import AppLayout from "@/layouts/app-layout";

import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";

import {
    SortableContext,
    verticalListSortingStrategy,
    useSortable,
    arrayMove
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

/* ================= TYPES ================= */
type ContentType = "text" | "image" | "video" | "file" | "youtube";

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
};

/* ================= ID ================= */
const getId = (data: any): string => {
    if (!data) return "";
    if (typeof data._id === "object" && data._id?.$oid) return data._id.$oid;
    return String(data._id || data.id);
};
const getYoutubeEmbed = (url: string) => {
    try {
        const parsed = new URL(url);

        if (parsed.hostname.includes("youtu.be")) {
            return `https://www.youtube.com/embed/${parsed.pathname.slice(1)}`;
        }

        return `https://www.youtube.com/embed/${parsed.searchParams.get("v")}`;
    } catch {
        return "";
    }
};

/* ================= ICONS & COLORS ================= */
const typeIcons = {
    text: <Type size={14} className="text-blue-500 dark:text-blue-400" />,
    image: <ImageIcon size={14} className="text-emerald-500 dark:text-emerald-400" />,
    video: <Video size={14} className="text-purple-500 dark:text-purple-400" />,
    file: <FileText size={14} className="text-amber-500 dark:text-amber-400" />,
    youtube: <Youtube size={14} className="text-red-500" />
};

const typeColors = {
    text: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/50",
    image: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50",
    video: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-900/50",
    file: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/50",
    youtube: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/50"
};

/* ================= ITEM ================= */
const SortableContent = ({
    content,
    moduleId,
    editingId,
    setEditingId,
    updateContentLocal,
    saveContent,
    deleteContent
}: any) => {

    const id = getId(content);
    const isEditing = editingId === id;

    // LOCAL STATE FOR FORM (to prevent input lag caused by re-rendering the whole page on every keystroke)
    const [localTitle, setLocalTitle] = useState(content.content?.title || "");
    const [localDesc, setLocalDesc] = useState(content.content?.description || "");
    const [localUrl, setLocalUrl] = useState(content.content?.url || "");

    // Sync local state when entering edit mode
    useEffect(() => {
        if (isEditing) {
            setLocalTitle(content.content?.title || "");
            setLocalDesc(content.content?.description || "");
            setLocalUrl(content.content?.url || "");
        }
    }, [isEditing, content.content]);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`flex gap-3 group bg-white dark:bg-[#060B1A]/80 backdrop-blur-sm p-3 sm:p-4 rounded-xl transition-all duration-200 border ${isEditing ? 'border-[#3B28F6] dark:border-[#7C5CFF] shadow-lg shadow-[#3B28F6]/5' : 'border-slate-200 dark:border-slate-800/80 hover:border-slate-350 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/30'}`}
        >

            {/* DRAG */}
            <div {...listeners} {...attributes} className="cursor-grab pt-1 text-slate-400 hover:text-[#3B28F6] dark:hover:text-[#7C5CFF] transition-colors flex flex-col items-center justify-start touch-none">
                <GripVertical size={20} />
            </div>

            <div className="flex-1 min-w-0">

                {isEditing ? (
                    <div className="flex flex-col gap-4">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.15em] mb-1.5 ml-1">Content Title</label>
                                <input
                                    value={localTitle}
                                    onChange={(e) => setLocalTitle(e.target.value)}
                                    placeholder="Enter title..."
                                    className="bg-slate-50 border border-slate-200 dark:bg-slate-950 dark:border-slate-800 px-4 py-2.5 rounded-xl w-full text-sm text-slate-900 dark:text-white outline-none focus:border-[#3B28F6] dark:focus:border-[#7C5CFF] focus:ring-1 focus:ring-[#3B28F6] dark:focus:ring-[#7C5CFF] transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                                />
                            </div>

                            {content.type === "text" && (
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.15em] mb-1.5 ml-1">Description / Text Content</label>
                                    <textarea
                                        value={localDesc}
                                        onChange={(e) => setLocalDesc(e.target.value)}
                                        placeholder="Write your content here..."
                                        className="bg-slate-50 border border-slate-200 dark:bg-slate-950 dark:border-slate-800 px-4 py-3 rounded-xl w-full text-sm text-slate-900 dark:text-white outline-none focus:border-[#3B28F6] dark:focus:border-[#7C5CFF] focus:ring-1 focus:ring-[#3B28F6] dark:focus:ring-[#7C5CFF] transition-all min-h-[120px] resize-y placeholder:text-slate-400 dark:placeholder:text-slate-600 leading-relaxed"
                                        rows={4}
                                    />
                                </div>
                            )}

                            {content.type === "youtube" && (
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.15em] mb-1.5 ml-1">YouTube URL</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                            <Youtube size={16} className="text-slate-400 dark:text-slate-500" />
                                        </div>
                                        <input
                                            value={localUrl}
                                            onChange={(e) => setLocalUrl(e.target.value)}
                                            placeholder="https://youtube.com/watch?v=..."
                                            className="bg-slate-50 border border-slate-200 dark:bg-slate-950 dark:border-slate-800 pl-10 pr-4 py-2.5 rounded-xl w-full text-sm text-slate-900 dark:text-white outline-none focus:border-[#3B28F6] dark:focus:border-[#7C5CFF] focus:ring-1 focus:ring-[#3B28F6] dark:focus:ring-[#7C5CFF] transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 mt-2 pt-4 border-t border-slate-150 dark:border-slate-800/80">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteContent(id, moduleId);
                                }}
                                className="flex items-center justify-center gap-1.5 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 px-3 py-2 sm:py-1.5 rounded-lg text-sm font-semibold transition-colors border border-rose-200 dark:border-transparent"
                            >
                                <Trash2 size={16} className="sm:w-3.5 sm:h-3.5" />
                                Delete Content
                            </button>

                            <div className="flex items-center gap-2 w-full sm:w-auto">
                                <button
                                    onClick={() => setEditingId(null)}
                                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-850 px-4 py-2 sm:py-1.5 rounded-lg text-sm font-semibold transition-colors border border-slate-200 dark:border-slate-700 sm:border-transparent"
                                >
                                    <X size={16} className="sm:w-3.5 sm:h-3.5" />
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
                                                url: localUrl
                                            }
                                        };
                                        updateContentLocal(moduleId, id, "title", localTitle);
                                        updateContentLocal(moduleId, id, "description", localDesc);
                                        updateContentLocal(moduleId, id, "url", localUrl);
                                        saveContent(newContent);
                                        setEditingId(null);
                                    }}
                                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-[#3B28F6] hover:bg-[#2a1ce0] text-white px-5 py-2 sm:py-1.5 rounded-lg text-sm font-semibold transition-colors shadow-md shadow-[#3B28F6]/10"
                                >
                                    <Check size={16} className="sm:w-3.5 sm:h-3.5" />
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div
                        onClick={() => setEditingId(id)}
                        className="cursor-pointer relative pr-8 group-hover:bg-slate-50/50 dark:group-hover:bg-slate-800/10 rounded-xl p-2 sm:p-3 -m-2 sm:-m-3 transition-colors w-full min-w-0"
                    >
                        <div className="flex items-center gap-2.5 mb-2 sm:mb-3">
                            <span className={`flex shrink-0 items-center gap-1.5 text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider border ${typeColors[content.type as keyof typeof typeColors] || "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-750"}`}>
                                {typeIcons[content.type as keyof typeof typeIcons]}
                                {content.type || "unknown"}
                            </span>
                            <h3 className="font-semibold text-sm sm:text-base text-slate-800 dark:text-white group-hover:text-[#3B28F6] dark:group-hover:text-[#7C5CFF] transition-colors line-clamp-1 break-all">
                                {content.content?.title || "Untitled Content"}
                            </h3>
                        </div>

                        {/* PREVIEW WRAPPER */}
                        <div className="mt-2 sm:mt-3 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40 overflow-hidden shadow-inner w-full">

                            {/* TEXT PREVIEW */}
                            {content.type === "text" && content.content?.description && (
                                <div className="p-4 sm:p-5 w-full overflow-hidden">
                                    <p className="text-sm sm:text-base text-slate-700 dark:text-slate-350 whitespace-pre-wrap break-words" style={{ wordBreak: 'break-word' }}>
                                        {content.content.description}
                                    </p>
                                </div>
                            )}

                            {/* IMAGE PREVIEW */}
                            {content.type === "image" && content.content?.url && (
                                <div className="flex justify-center bg-black/5 dark:bg-black/60 p-2 sm:p-4 group/img relative">
                                    <img
                                        src={content.content.url}
                                        className="max-w-full h-auto max-h-[300px] sm:max-h-[400px] rounded-lg object-contain transition duration-500 group-hover/img:scale-[1.02]"
                                        alt={content.content?.title || "Image content"}
                                    />
                                    <div className="absolute inset-0 bg-slate-900/0 group-hover/img:bg-slate-900/5 dark:group-hover/img:bg-slate-900/10 transition-colors pointer-events-none"></div>
                                </div>
                            )}

                            {/* VIDEO PREVIEW */}
                            {content.type === "video" && content.content?.url && (
                                <div className="flex justify-center bg-black/10 dark:bg-black/80 p-2 sm:p-4">
                                    <video
                                        src={content.content.url}
                                        controls
                                        className="max-w-full w-auto h-auto max-h-[300px] sm:max-h-[400px] rounded-lg outline-none shadow-lg"
                                    />
                                </div>
                            )}

                            {/* YOUTUBE PREVIEW */}
                            {content.type === "youtube" && content.content?.url && (
                                <div className="w-full bg-black">
                                    <div className="max-w-4xl mx-auto aspect-video">
                                        <iframe
                                            src={getYoutubeEmbed(content.content.url)}
                                            className="w-full h-full"
                                            allowFullScreen
                                        />
                                    </div>
                                    <div className="bg-slate-100 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800 px-4 py-2 flex items-center gap-2">
                                        <Youtube size={14} className="text-red-500 shrink-0" />
                                        <a href={content.content.url} target="_blank" rel="noreferrer" className="text-xs text-slate-500 dark:text-slate-400 hover:text-[#3B28F6] dark:hover:text-[#7C5CFF] truncate hover:underline" onClick={(e) => e.stopPropagation()}>
                                            {content.content.url}
                                        </a>
                                    </div>
                                </div>
                            )}

                            {/* PDF PREVIEW */}
                            {content.type === "file" && content.content?.url?.endsWith(".pdf") && (
                                <div className="h-[300px] sm:h-[450px] bg-slate-100 dark:bg-slate-900/50">
                                    <iframe
                                        src={content.content.url}
                                        className="w-full h-full"
                                    />
                                </div>
                            )}

                            {/* OTHER FILE PREVIEW */}
                            {content.type === "file" && content.content?.url && !content.content.url.endsWith(".pdf") && (
                                <div className="p-4 sm:p-6 flex items-center justify-center bg-slate-50 dark:bg-slate-900/30">
                                    <a
                                        href={content.content.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex flex-col items-center gap-3 text-[#3B28F6] dark:text-[#7C5CFF] hover:text-[#2a1ce0] dark:hover:text-[#8B5CF6] group/link"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <div className="p-4 bg-[#3B28F6]/10 dark:bg-[#7C5CFF]/10 rounded-2xl group-hover/link:bg-[#3B28F6]/15 dark:group-hover/link:bg-[#7C5CFF]/15 group-hover/link:scale-110 transition-all duration-300">
                                            <FileText size={32} />
                                        </div>
                                        <span className="text-sm font-semibold hover:underline">Download Attached File</span>
                                    </a>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                deleteContent(id, moduleId);
                            }}
                            className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-all duration-200 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 p-2 rounded-lg"
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
    const [newTitle, setNewTitle] = useState("");

    // Inline state for YouTube input
    const [activeYoutubeModule, setActiveYoutubeModule] = useState<string | null>(null);
    const [youtubeUrl, setYoutubeUrl] = useState("");

    const rollback = (module: Module, tempId: string) => {
        setModules(prev =>
            prev.map(m => {
                if (getId(m) !== getId(module)) return m;

                return {
                    ...m,
                    contents: m.contents.filter(c => getId(c) !== tempId)
                };
            })
        );
    };

    // Sync local state when `path` prop updates from backend (e.g. after adding content)
    useEffect(() => {
        setModules(path.modules);
    }, [path]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 5 }
        })
    );

    const createModule = () => {
        if (!newTitle.trim()) return;

        router.post("/admin/modules", {
            title: newTitle,
            path_id: getId(path)
        }, {
            onSuccess: () => {
                setNewTitle("");
                router.reload();
            }
        });
    };

    const submitYoutube = (module: Module) => {
        if (!youtubeUrl.trim()) return;

        const tempId = "temp-" + Date.now();
        const type = "youtube";

        setModules(prev =>
            prev.map(m => {
                if (getId(m) !== getId(module)) return m;

                return {
                    ...m,
                    contents: [
                        ...m.contents,
                        {
                            _id: tempId,
                            type,
                            order: m.contents.length + 1,
                            content: { url: youtubeUrl }
                        }
                    ]
                };
            })
        );

        router.post(`/admin/modules/${getId(module)}/contents`, {
            type,
            url: youtubeUrl
        }, {
            preserveScroll: true,
            onSuccess: () => router.reload({ only: ["path"] }),
            onError: () => rollback(module, tempId)
        });

        setActiveYoutubeModule(null);
        setYoutubeUrl("");
    };

    const renderAddButtons = (moduleId: string, module: Module, isCentered = false) => {
        return activeYoutubeModule === moduleId ? (
            <div className={`flex flex-col sm:flex-row gap-3 bg-slate-900/80 p-4 rounded-xl border border-red-500/30 animate-in fade-in zoom-in-95 duration-200 shadow-inner w-full ${isCentered ? 'max-w-xl mx-auto' : ''}`}>
                <div className="flex-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Youtube size={16} className="text-red-500" />
                    </div>
                    <input
                        autoFocus
                        value={youtubeUrl}
                        onChange={e => setYoutubeUrl(e.target.value)}
                        placeholder="Paste YouTube URL here (https://...)"
                        className="w-full bg-slate-950/80 border border-slate-700 pl-10 pr-4 py-2.5 rounded-lg text-sm text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') submitYoutube(module);
                            if (e.key === 'Escape') setActiveYoutubeModule(null);
                        }}
                    />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                        onClick={() => setActiveYoutubeModule(null)}
                        className="flex-1 sm:flex-none px-4 py-2.5 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors border border-slate-700 sm:border-transparent"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => submitYoutube(module)}
                        className="flex-1 sm:flex-none px-4 py-2.5 text-sm font-medium bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors shadow-lg shadow-red-500/20"
                    >
                        Add Video
                    </button>
                </div>
            </div>
        ) : (
            <div className={`grid grid-cols-2 sm:flex sm:flex-wrap gap-2.5 w-full ${isCentered ? 'justify-center' : ''}`}>
                {[
                    { type: 'text', icon: Type, color: 'hover:border-blue-500/50 hover:text-blue-400 hover:bg-blue-500/10 border-slate-700/80 bg-slate-900/80' },
                    { type: 'image', icon: ImageIcon, color: 'hover:border-emerald-500/50 hover:text-emerald-400 hover:bg-emerald-500/10 border-slate-700/80 bg-slate-900/80' },
                    { type: 'video', icon: Video, color: 'hover:border-purple-500/50 hover:text-purple-400 hover:bg-purple-500/10 border-slate-700/80 bg-slate-900/80' },
                    { type: 'file', icon: FileText, color: 'hover:border-amber-500/50 hover:text-amber-400 hover:bg-amber-500/10 border-slate-700/80 bg-slate-900/80' },
                    { type: 'youtube', icon: Youtube, color: 'hover:border-red-500/50 hover:text-red-500 hover:bg-red-500/10 border-slate-700/80 bg-slate-900/80' }
                ].map(({ type, icon: Icon, color }) => (
                    <button
                        key={type}
                        onClick={() => {
                            if (type === 'youtube') {
                                setActiveYoutubeModule(moduleId);
                                setYoutubeUrl("");
                            } else {
                                addContent(module, type as ContentType);
                            }
                        }}
                        className={`flex flex-1 min-w-[100px] justify-center items-center gap-2 text-xs font-medium text-slate-300 px-4 py-2.5 rounded-xl border transition-all duration-200 ${color} shadow-sm`}
                    >
                        <Icon size={16} className="opacity-80" />
                        <span className="capitalize">{type}</span>
                    </button>
                ))}
            </div>
        );
    };

    const addContent = (module: Module, type: ContentType) => {

        const tempId = "temp-" + Date.now();

        // ================= TEXT =================
        if (type === "text") {

            setModules(prev =>
                prev.map(m => {
                    if (getId(m) !== getId(module)) return m;

                    return {
                        ...m,
                        contents: [
                            ...m.contents,
                            {
                                _id: tempId,
                                type,
                                order: m.contents.length + 1,
                                content: {}
                            }
                        ]
                    };
                })
            );

            router.post(`/admin/modules/${getId(module)}/contents`, { type }, {
                preserveScroll: true,
                onSuccess: () => router.reload({ only: ["path"] }),
                onError: () => rollback(module, tempId)
            });

            return;
        }

        // ================= FILE BASED =================
        const input = document.createElement("input");
        input.type = "file";

        if (type === "image") input.accept = "image/*";
        if (type === "video") input.accept = "video/*";

        input.onchange = () => {

            const file = input.files?.[0];
            if (!file) return;

            // optimistic UI
            setModules(prev =>
                prev.map(m => {
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
                                    url: URL.createObjectURL(file)
                                }
                            }
                        ]
                    };
                })
            );

            const formData = new FormData();
            formData.append("type", type);
            formData.append("file", file);

            router.post(`/admin/modules/${getId(module)}/contents`, formData, {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: () => router.reload({ only: ["path"] }),
                onError: () => rollback(module, tempId)
            });
        };

        input.click();
    };

    const deleteContent = (id: string, moduleId: string) => {
        if (!confirm("Are you sure you want to delete this content?")) return;

        setModules(prev =>
            prev.map(m =>
                getId(m) === moduleId
                    ? { ...m, contents: m.contents.filter(c => getId(c) !== id) }
                    : m
            )
        );

        router.delete(`/admin/module-contents/${id}`);
    };

    const updateContentLocal = useCallback((
        moduleId: string,
        contentId: string,
        key: keyof ModuleContent["content"],
        value: string
    ) => {
        setModules(prev =>
            prev.map(m => {
                if (getId(m) !== moduleId) return m;

                return {
                    ...m,
                    contents: m.contents.map(c =>
                        getId(c) === contentId
                            ? { ...c, content: { ...c.content, [key]: value } }
                            : c
                    )
                };
            })
        );
    }, []);

    const saveContent = (content: ModuleContent) => {
        router.put(`/admin/module-contents/${getId(content)}`, {
            title: content.content?.title,
            description: content.content?.description,
            url: content.content?.url,
        }, {
            preserveScroll: true
        });
    };

    const handleDragEnd = (event: any, module: Module) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = module.contents.findIndex(c => getId(c) === active.id);
        const newIndex = module.contents.findIndex(c => getId(c) === over.id);

        if (oldIndex === -1 || newIndex === -1) return;

        const newContents = arrayMove(module.contents, oldIndex, newIndex);

        setModules(prev =>
            prev.map(m =>
                getId(m) === getId(module)
                    ? { ...m, contents: newContents }
                    : m
            )
        );

        router.put("/admin/module-contents/reorder", {
            contents: newContents.map((c, i) => ({
                id: getId(c),
                order: i + 1
            }))
        });
    };

    return (
        <AppLayout>
            <div 
                className="relative min-h-screen bg-[#f8fafc] dark:bg-[#030712] text-slate-800 dark:text-white px-4 py-8 sm:px-6 lg:px-10 overflow-hidden transition-colors duration-200"
                style={{ fontFamily: "'Outfit', sans-serif" }}
            >
                {/* Subtle top-center ambient glow (visible on dark mode) */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] pointer-events-none select-none z-0 bg-indigo-500/5 dark:bg-indigo-500/5 rounded-full blur-[120px]" />

                <div className="relative z-10 mx-auto w-full space-y-6">

                    {/* HEADER */}
                    <header
                        className="relative overflow-hidden rounded-xl px-6 py-5 bg-[#f5f6ff] dark:bg-[#0d0f17] border border-slate-200 dark:border-white/5 w-full"
                        style={{
                            backgroundImage: `
                                linear-gradient(rgba(59,40,246,0.07) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(59,40,246,0.07) 1px, transparent 1px)
                            `,
                            backgroundSize: "40px 40px",
                        }}
                    >
                        {/* Corner brackets */}
                        <span className="absolute left-3.5 top-3.5 h-3 w-3 border-l border-t dark:border-[rgba(59,40,246,0.45)] border-[rgba(59,40,246,0.2)]" />
                        <span className="absolute right-3.5 top-3.5 h-3 w-3 border-r border-t dark:border-[rgba(59,40,246,0.45)] border-[rgba(59,40,246,0.2)]" />
                        <span className="absolute bottom-3.5 left-3.5 h-3 w-3 border-b border-l dark:border-[rgba(59,40,246,0.45)] border-[rgba(59,40,246,0.2)]" />
                        <span className="absolute bottom-3.5 right-3.5 h-3 w-3 border-b border-r dark:border-[rgba(59,40,246,0.45)] border-[rgba(59,40,246,0.2)]" />

                        <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex flex-col gap-2">
                                <button 
                                    onClick={() => window.history.back()}
                                    className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-[#3B28F6] dark:hover:text-[#7C5CFF] transition-colors text-xs font-semibold uppercase tracking-wider"
                                >
                                    <ArrowLeft size={14} /> Back
                                </button>
                                
                                {/* Badge */}
                                <div className="inline-flex w-fit items-center gap-1.5 rounded border px-2.5 py-1
                                    dark:border-[rgba(59,40,246,0.35)] dark:bg-[rgba(59,40,246,0.1)]
                                    border-[rgba(59,40,246,0.2)] bg-[rgba(59,40,246,0.06)] mt-1"
                                >
                                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#3B28F6]" />
                                    <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#3B28F6]">
                                        Path Module Builder
                                    </span>
                                </div>

                                {/* Title */}
                                <h1
                                    className="m-0 text-2xl sm:text-3xl font-bold leading-none tracking-tight text-[#3B28F6] dark:text-[#7C5CFF]"
                                    style={{
                                        fontFamily: "Orbitron, sans-serif",
                                    }}
                                >
                                    Module Builder
                                </h1>

                                {/* Subtitle */}
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-slate-500 dark:text-slate-400 text-xs font-medium">Path:</span>
                                    <span className="text-slate-700 dark:text-slate-350 text-xs font-semibold px-2.5 py-0.5 rounded bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">{path.name}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => router.get(`/admin/paths/${getId(path)}/quiz/create`)}
                                className="relative flex items-center gap-3 border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm shadow-slate-200/80 transition-all hover:bg-slate-50 hover:shadow-md hover:shadow-slate-200 active:scale-95 active:shadow-none dark:border-zinc-600 dark:bg-zinc-800 dark:text-neutral-300 dark:shadow-zinc-900 dark:hover:bg-zinc-700 dark:hover:shadow-zinc-900"
                            >
                                <span className="h-3.5 w-0.5 bg-indigo-500 shrink-0" />
                                <span>Manage Final Quiz</span>
                            </button>
                        </div>
                    </header>

                    {/* CREATE MODULE */}
                    <div className="relative bg-white dark:bg-[#060B1A]/80 border border-slate-200 dark:border-white/8 rounded-xl p-5 shadow-sm flex flex-col sm:flex-row gap-4 items-center">
                        {/* Top accent line */}
                        <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent dark:via-slate-800" />

                        <div className="flex-1 w-full relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Layers size={18} className="text-slate-450 dark:text-slate-500" />
                            </div>
                            <input
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && createModule()}
                                placeholder="Enter new module title..."
                                className="w-full bg-slate-50 border border-slate-200 dark:bg-slate-950 dark:border-slate-800 pl-11 pr-4 py-3 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:border-[#3B28F6] focus:ring-1 focus:ring-[#3B28F6] dark:focus:border-[#7C5CFF] dark:focus:ring-[#7C5CFF] transition-shadow placeholder:text-slate-400 dark:placeholder:text-slate-600"
                            />
                        </div>
                        <button
                            onClick={createModule}
                            disabled={!newTitle.trim()}
                            className="relative flex w-full items-center justify-center gap-3 border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm shadow-slate-200/80 transition-all hover:bg-slate-50 hover:shadow-md hover:shadow-slate-200 active:scale-95 active:shadow-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-neutral-300 dark:shadow-zinc-900 dark:hover:bg-zinc-700 dark:hover:shadow-zinc-900 sm:w-auto"
                        >
                            <span className="h-3.5 w-0.5 shrink-0 bg-indigo-500" />
                            <span>Add Module</span>
                        </button>
                    </div>

                    {/* MODULES LIST */}
                    <div className="space-y-4">
                        {modules.map(module => {

                            const moduleId = getId(module);
                            const isOpen = openModule === moduleId;

                            return (
                                <div key={moduleId} className="bg-white dark:bg-[#060B1A]/80 border border-slate-200 dark:border-white/8 rounded-xl overflow-hidden shadow-sm transition-all duration-300 relative">
                                    {/* Top accent line */}
                                    <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent dark:via-slate-800" />

                                    <div
                                        onClick={() => setOpenModule(isOpen ? null : moduleId)}
                                        className={`p-5 flex justify-between items-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors ${isOpen ? 'bg-slate-50/50 dark:bg-slate-800/10 border-b border-slate-100 dark:border-white/5' : ''}`}
                                    >
                                        <div className="flex gap-4 items-center">
                                            <div className={`p-2 rounded-lg transition-colors ${isOpen ? 'bg-[#3B28F6]/10 dark:bg-[#7C5CFF]/15 text-[#3B28F6] dark:text-[#7C5CFF]' : 'bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800'}`}>
                                                <Layers size={20} />
                                            </div>
                                            <h2 className="text-lg font-bold text-slate-800 dark:text-white">{module.title}</h2>
                                            <span className="text-xs font-semibold bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-800 shadow-sm">
                                                {module.contents.length} items
                                            </span>
                                        </div>
                                        <div className={`p-2 rounded-full transition-all duration-300 ${isOpen ? 'bg-slate-100 dark:bg-slate-850 text-slate-800 dark:text-white rotate-180' : 'text-slate-400 dark:text-slate-550'}`}>
                                            <ChevronDown size={20} />
                                        </div>
                                    </div>

                                    {isOpen && (
                                        <div className="p-5 flex flex-col gap-5 bg-slate-50/10 dark:bg-slate-950/20">

                                            <div className="space-y-4">
                                                <DndContext
                                                    sensors={sensors}
                                                    collisionDetection={closestCenter}
                                                    onDragEnd={(e) => handleDragEnd(e, module)}
                                                >
                                                    <SortableContext
                                                        items={module.contents.map(c => getId(c))}
                                                        strategy={verticalListSortingStrategy}
                                                    >
                                                        <div className="flex flex-col gap-4">
                                                            {module.contents.map(c => (
                                                                <SortableContent
                                                                    key={getId(c)}
                                                                    content={c}
                                                                    moduleId={moduleId}
                                                                    editingId={editingId}
                                                                    setEditingId={setEditingId}
                                                                    updateContentLocal={updateContentLocal}
                                                                    saveContent={saveContent}
                                                                    deleteContent={deleteContent}
                                                                />
                                                            ))}
                                                        </div>
                                                    </SortableContext>
                                                </DndContext>

                                                {module.contents.length === 0 && (
                                                    <div className="flex flex-col items-center justify-center p-8 sm:p-12 border-2 border-dashed border-slate-200 dark:border-slate-800/60 rounded-xl bg-slate-50/30 dark:bg-slate-900/10 text-center">
                                                        <Layers size={40} className="text-slate-400 dark:text-slate-600 mb-4 opacity-50" />
                                                        <p className="text-slate-700 dark:text-slate-300 font-semibold mb-1">No content in this module yet.</p>
                                                        <p className="text-slate-500 dark:text-slate-500 text-xs mb-8">Add your first content block to get started.</p>

                                                        <div className="w-full max-w-3xl">
                                                            {renderAddButtons(moduleId, module, true)}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {module.contents.length > 0 && (
                                                <div className="flex flex-col gap-3 mt-4 pt-5 border-t border-slate-200 dark:border-slate-800/80">
                                                    <span className="text-xs font-bold text-slate-455 dark:text-slate-500 uppercase tracking-wider pl-1">Add Content Block</span>
                                                    {renderAddButtons(moduleId, module, false)}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                </div>
                            );
                        })}

                        {modules.length === 0 && (
                            <div className="text-center py-20 border-2 border-dashed border-slate-200 dark:border-slate-800/60 rounded-xl bg-white dark:bg-[#060B1A]/80 shadow-sm">
                                <Layers className="mx-auto text-slate-400 dark:text-slate-600 mb-4" size={48} />
                                <h3 className="text-lg font-semibold text-slate-700 dark:text-white mb-1">No Modules Created</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm">Start building your learning path by creating a module above.</p>
                            </div>
                        )}

                    </div>

                </div>
            </div>
        </AppLayout>
    );
}