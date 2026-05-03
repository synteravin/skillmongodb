import React, { useState, useCallback, useEffect } from "react";
import { router } from "@inertiajs/react";
import { ChevronDown, Plus, Layers, Trash2, GripVertical, Type, Image as ImageIcon, Video, FileText, Youtube, X, Check } from "lucide-react";
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
    text: <Type size={14} className="text-blue-400" />,
    image: <ImageIcon size={14} className="text-emerald-400" />,
    video: <Video size={14} className="text-purple-400" />,
    file: <FileText size={14} className="text-amber-400" />,
    youtube: <Youtube size={14} className="text-red-500" />
};

const typeColors = {
    text: "bg-blue-500 text-blue-400 border-blue-500",
    image: "bg-emerald-500 text-emerald-400 border-emerald-500",
    video: "bg-purple-500 text-purple-400 border-purple-500",
    file: "bg-amber-500 text-amber-400 border-amber-500",
    youtube: "bg-red-500 text-red-400 border-red-500"
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
            className={`flex gap-3 group bg-slate-900 backdrop-blur-sm p-3 sm:p-4 rounded-xl transition-all duration-200 border ${isEditing ? 'border-indigo-500 shadow-lg shadow-indigo-500' : 'border-slate-800 hover:border-slate-700 hover:bg-slate-800 hover:-translate-y-0.5'}`}
        >

            {/* DRAG */}
            <div {...listeners} {...attributes} className="cursor-grab pt-1 text-slate-600 hover:text-indigo-400 transition-colors flex flex-col items-center justify-start touch-none">
                <GripVertical size={20} />
            </div>

            <div className="flex-1 min-w-0">

                {isEditing ? (
                    <div className="flex flex-col gap-4">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1.5 ml-1">Content Title</label>
                                <input
                                    value={localTitle}
                                    onChange={(e) => setLocalTitle(e.target.value)}
                                    placeholder="Enter title..."
                                    className="bg-slate-950 border border-slate-800 px-4 py-2.5 rounded-xl w-full text-sm text-white outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
                                />
                            </div>

                            {content.type === "text" && (
                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-1.5 ml-1">Description / Text Content</label>
                                    <textarea
                                        value={localDesc}
                                        onChange={(e) => setLocalDesc(e.target.value)}
                                        placeholder="Write your content here..."
                                        className="bg-slate-950 border border-slate-800 px-4 py-3 rounded-xl w-full text-sm text-white outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all min-h-[120px] resize-y placeholder:text-slate-600 leading-relaxed"
                                        rows={4}
                                    />
                                </div>
                            )}

                            {content.type === "youtube" && (
                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-1.5 ml-1">YouTube URL</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                            <Youtube size={16} className="text-slate-500" />
                                        </div>
                                        <input
                                            value={localUrl}
                                            onChange={(e) => setLocalUrl(e.target.value)}
                                            placeholder="https://youtube.com/watch?v=..."
                                            className="bg-slate-950 border border-slate-800 pl-10 pr-4 py-2.5 rounded-xl w-full text-sm text-white outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 mt-2 pt-4 border-t border-slate-800">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteContent(id, moduleId);
                                }}
                                className="flex items-center justify-center gap-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500 px-3 py-2 sm:py-1.5 rounded-lg text-sm font-medium transition-colors border border-rose-500 sm:border-transparent"
                            >
                                <Trash2 size={16} className="sm:w-3.5 sm:h-3.5" />
                                Delete Content
                            </button>

                            <div className="flex items-center gap-2 w-full sm:w-auto">
                                <button
                                    onClick={() => setEditingId(null)}
                                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 text-slate-400 hover:text-white hover:bg-slate-800 px-4 py-2 sm:py-1.5 rounded-lg text-sm font-medium transition-colors border border-slate-700 sm:border-transparent"
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
                                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 sm:py-1.5 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-indigo-500/20"
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
                        className="cursor-pointer relative pr-8 group-hover:bg-slate-800/30 rounded-xl p-2 sm:p-3 -m-2 sm:-m-3 transition-colors w-full min-w-0"
                    >
                        <div className="flex items-center gap-2.5 mb-2 sm:mb-3">
                            <span className={`flex shrink-0 items-center gap-1.5 text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider border ${typeColors[content.type as keyof typeof typeColors] || "bg-slate-700 text-slate-300 border-slate-600"}`}>
                                {typeIcons[content.type as keyof typeof typeIcons]}
                                {content.type || "unknown"}
                            </span>
                            <h3 className="font-semibold text-sm sm:text-base text-white group-hover:text-indigo-400 transition-colors line-clamp-1 break-all">
                                {content.content?.title || "Untitled Content"}
                            </h3>
                        </div>

                        {/* PREVIEW WRAPPER */}
                        <div className="mt-2 sm:mt-3 rounded-xl border border-slate-800/80 bg-slate-950/40 overflow-hidden shadow-inner w-full">

                            {/* TEXT PREVIEW */}
                            {content.type === "text" && content.content?.description && (
                                <div className="p-4 sm:p-5 w-full overflow-hidden">
                                    <p className="text-sm sm:text-base text-slate-300 whitespace-pre-wrap break-words" style={{ wordBreak: 'break-word' }}>
                                        {content.content.description}
                                    </p>
                                </div>
                            )}

                            {/* IMAGE PREVIEW */}
                            {content.type === "image" && content.content?.url && (
                                <div className="flex justify-center bg-black/60 p-2 sm:p-4 group/img relative">
                                    <img
                                        src={content.content.url}
                                        className="max-w-full h-auto max-h-[300px] sm:max-h-[400px] rounded-lg object-contain transition duration-500 group-hover/img:scale-[1.02]"
                                        alt={content.content?.title || "Image content"}
                                    />
                                    <div className="absolute inset-0 bg-slate-900/0 group-hover/img:bg-slate-900/10 transition-colors pointer-events-none"></div>
                                </div>
                            )}

                            {/* VIDEO PREVIEW */}
                            {content.type === "video" && content.content?.url && (
                                <div className="flex justify-center bg-black/80 p-2 sm:p-4">
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
                                    <div className="bg-slate-900/80 border-t border-slate-800 px-4 py-2 flex items-center gap-2">
                                        <Youtube size={14} className="text-red-500 shrink-0" />
                                        <a href={content.content.url} target="_blank" rel="noreferrer" className="text-xs text-slate-400 hover:text-blue-400 truncate hover:underline" onClick={(e) => e.stopPropagation()}>
                                            {content.content.url}
                                        </a>
                                    </div>
                                </div>
                            )}

                            {/* PDF PREVIEW */}
                            {content.type === "file" && content.content?.url?.endsWith(".pdf") && (
                                <div className="h-[300px] sm:h-[450px] bg-slate-900/50">
                                    <iframe
                                        src={content.content.url}
                                        className="w-full h-full"
                                    />
                                </div>
                            )}

                            {/* OTHER FILE PREVIEW */}
                            {content.type === "file" && content.content?.url && !content.content.url.endsWith(".pdf") && (
                                <div className="p-4 sm:p-6 flex items-center justify-center bg-slate-900/30">
                                    <a
                                        href={content.content.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex flex-col items-center gap-3 text-indigo-400 hover:text-indigo-300 group/link"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <div className="p-4 bg-indigo-500/10 rounded-2xl group-hover/link:bg-indigo-500/20 group-hover/link:scale-110 transition-all duration-300">
                                            <FileText size={32} />
                                        </div>
                                        <span className="text-sm font-medium hover:underline">Download Attached File</span>
                                    </a>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                deleteContent(id, moduleId);
                            }}
                            className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-all duration-200 text-rose-500 hover:text-rose-400 hover:bg-rose-500/10 p-2 rounded-lg"
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
            <div className="min-h-screen p-4 sm:p-6 lg:p-8 w-full mx-auto space-y-6 sm:space-y-8">

                {/* HEADER */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-lg">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
                            <div className="p-2 bg-indigo-500 rounded-lg">
                                <Layers className="text-indigo-400" size={24} />
                            </div>
                            Module Builder
                        </h1>
                        <div className="flex items-center gap-2 mt-2">
                            <span className="text-slate-500 text-sm">Path:</span>
                            <span className="text-slate-300 text-sm font-medium px-3 py-1 rounded-full bg-slate-800 border border-slate-700 shadow-inner">{path.name}</span>
                        </div>
                    </div>

                    <button
                        onClick={() => router.get(`/admin/paths/${getId(path)}/quiz/create`)}
                        className="group flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-0.5"
                    >
                        <span>🎯 Manage Final Quiz</span>
                    </button>
                </div>

                {/* CREATE MODULE */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row gap-4 items-center">
                    <div className="flex-1 w-full relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Layers size={18} className="text-slate-500" />
                        </div>
                        <input
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && createModule()}
                            placeholder="Enter new module title..."
                            className="w-full bg-slate-950 border border-slate-800 pl-11 pr-4 py-3 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-shadow placeholder:text-slate-600"
                        />
                    </div>
                    <button
                        onClick={createModule}
                        disabled={!newTitle.trim()}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl text-sm font-medium transition-all shadow-lg shadow-indigo-500/20"
                    >
                        <Plus size={18} /> Add Module
                    </button>
                </div>

                {/* MODULES LIST */}
                <div className="space-y-4">
                    {modules.map(module => {

                        const moduleId = getId(module);
                        const isOpen = openModule === moduleId;

                        return (
                            <div key={moduleId} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg transition-all duration-300">

                                <div
                                    onClick={() => setOpenModule(isOpen ? null : moduleId)}
                                    className={`p-5 flex justify-between items-center cursor-pointer hover:bg-slate-800 transition-colors ${isOpen ? 'bg-slate-800 border-b border-slate-800' : ''}`}
                                >
                                    <div className="flex gap-4 items-center">
                                        <div className={`p-2 rounded-lg transition-colors ${isOpen ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-800 text-slate-400'}`}>
                                            <Layers size={20} />
                                        </div>
                                        <h2 className="text-lg font-semibold text-white">{module.title}</h2>
                                        <span className="text-xs font-medium bg-slate-800 text-slate-400 px-2.5 py-1 rounded-full border border-slate-700">
                                            {module.contents.length} items
                                        </span>
                                    </div>
                                    <div className={`p-2 rounded-full transition-all duration-300 ${isOpen ? 'bg-slate-800 text-white rotate-180' : 'text-slate-500'}`}>
                                        <ChevronDown size={20} />
                                    </div>
                                </div>

                                {isOpen && (
                                    <div className="p-5 flex flex-col gap-5 bg-slate-950/30">

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
                                                <div className="flex flex-col items-center justify-center p-8 sm:p-12 border-2 border-dashed border-slate-800/60 rounded-xl bg-slate-900/20 text-center">
                                                    <Layers size={40} className="text-slate-600 mb-4 opacity-50" />
                                                    <p className="text-slate-300 font-medium mb-1">No content in this module yet.</p>
                                                    <p className="text-slate-500 text-sm mb-8">Add your first content block to get started.</p>

                                                    <div className="w-full max-w-3xl">
                                                        {renderAddButtons(moduleId, module, true)}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {module.contents.length > 0 && (
                                            <div className="flex flex-col gap-3 mt-4 pt-5 border-t border-slate-800/80">
                                                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider pl-1">Add Content Block</span>
                                                {renderAddButtons(moduleId, module, false)}
                                            </div>
                                        )}
                                    </div>
                                )}

                            </div>
                        );
                    })}

                    {modules.length === 0 && (
                        <div className="text-center py-20 border-2 border-dashed border-slate-800/60 rounded-2xl bg-slate-900/30">
                            <Layers className="mx-auto text-slate-500 mb-4" size={48} />
                            <h3 className="text-lg font-semibold text-white mb-1">No Modules Created</h3>
                            <p className="text-slate-400 text-sm">Start building your learning path by creating a module above.</p>
                        </div>
                    )}

                </div>
            </div>
        </AppLayout>
    );
}