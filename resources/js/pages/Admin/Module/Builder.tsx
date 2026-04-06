import React, { useState, useCallback, useEffect } from "react";
import { router } from "@inertiajs/react";
import { ChevronDown, Plus, Layers, Trash2 } from "lucide-react";
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
            className="flex gap-3 group bg-slate-800/40 hover:bg-slate-800/70 p-3 rounded-xl transition-all duration-200 border border-transparent hover:border-slate-700"
        >

            {/* DRAG */}
            <div {...listeners} {...attributes} className="cursor-grab pt-2 text-gray-500 hover:text-blue-400 transition">
                ⋮⋮
            </div>

            <div className="flex-1 min-w-0">

                {editingId === id ? (
                    <div className="flex flex-col gap-2">
                        <input
                            value={content.content?.title || ""}
                            onChange={(e) =>
                                updateContentLocal(moduleId, id, "title", e.target.value)
                            }
                            placeholder="Title..."
                            className="bg-slate-700/60 px-3 py-2 rounded-lg w-full text-sm outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        {content.type === "text" && (
                            <textarea
                                value={content.content?.description || ""}
                                onChange={(e) =>
                                    updateContentLocal(moduleId, id, "description", e.target.value)
                                }
                                placeholder="Description..."
                                className="bg-slate-700/60 px-3 py-2 rounded-lg w-full text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                rows={3}
                            />
                        )}

                        {content.type === "youtube" && (
                            <input
                                value={content.content?.url || ""}
                                onChange={(e) =>
                                    updateContentLocal(moduleId, id, "url", e.target.value)
                                }
                                placeholder="YouTube URL (https://...)"
                                className="bg-slate-700/60 px-3 py-2 rounded-lg w-full text-sm outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        )}

                        <div className="flex justify-between mt-2">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteContent(id, moduleId);
                                }}
                                className="text-red-400 hover:text-red-300 text-sm font-medium"
                            >
                                Delete
                            </button>

                            <div className="flex gap-3">
                                <button onClick={() => setEditingId(null)} className="text-gray-400 text-sm font-medium">
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        saveContent(content);
                                        setEditingId(null);
                                    }}
                                    className="text-blue-400 text-sm font-medium"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div
                        onClick={() => setEditingId(id)}
                        className="cursor-text relative pr-6 group-hover:bg-slate-800/50 rounded-lg"
                    >
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-700 text-slate-300 uppercase tracking-widest">
                                {content.type || "unknown"}
                            </span>
                            <h3 className="font-semibold text-sm text-white">
                                {content.content?.title || "Untitled"}
                            </h3>
                        </div>

                        {content.type === "text" && content.content?.description && (
                            <p className="text-sm text-gray-400 whitespace-pre-line break-words leading-relaxed mt-1">
                                {content.content.description}
                            </p>
                        )}
                        
                        {content.type === "youtube" && content.content?.url && (
                            <p className="text-sm text-blue-400 break-all mt-1">
                                {content.content.url}
                            </p>
                        )}

                        {(content.type === "image" || content.type === "video" || content.type === "file") && content.content?.url && (
                            <a href={content.content.url} target="_blank" rel="noreferrer" className="text-sm text-blue-400 break-all hover:underline mt-1 block" onClick={e => e.stopPropagation()}>
                                {content.content?.name || "View File"}
                            </a>
                        )}

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                deleteContent(id, moduleId);
                            }}
                            className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition text-red-500 hover:text-red-400 p-1"
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
        if (!newTitle) return;

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

    const addContent = (module: Module, type: ContentType) => {

        const tempId = "temp-" + Date.now();

        // 🔥 1. UPDATE UI DULU (INSTANT)
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

        // 🔥 2. HIT BACKEND
        router.post(`/admin/modules/${module.slug}/contents`, { type }, {
            preserveScroll: true,

            onSuccess: () => {
                // 🔥 SYNC DATA REAL (GANTI TEMP)
                router.reload({ only: ["path"] });
            },

            onError: () => {
                // rollback kalau gagal
                setModules(prev =>
                    prev.map(m => {
                        if (getId(m) !== getId(module)) return m;

                        return {
                            ...m,
                            contents: m.contents.filter(c => getId(c) !== tempId)
                        };
                    })
                );
            }
        });
    };

    const deleteContent = (id: string, moduleId: string) => {
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
            <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#020617] to-black text-white px-6 py-8">

                <div className="max-w-5xl mx-auto flex flex-col gap-8">

                    <h1 className="text-3xl font-bold tracking-tight">
                        Module Builder — {path.name}
                    </h1>

                    {/* CREATE */}
                    <div className="flex gap-3 bg-slate-900/70 border border-slate-800 rounded-xl px-4 py-3 shadow-sm">
                        <input
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            placeholder="Module title..."
                            className="flex-1 bg-transparent outline-none text-sm placeholder:text-gray-500"
                        />
                        <button
                            onClick={createModule}
                            className="bg-blue-600 hover:bg-blue-500 transition px-4 py-2 rounded-lg flex items-center gap-2"
                        >
                            <Plus size={16} /> Add
                        </button>
                    </div>

                    {/* MODULES */}
                    {modules.map(module => {

                        const moduleId = getId(module);
                        const isOpen = openModule === moduleId;

                        return (
                            <div key={moduleId} className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden">

                                <div
                                    onClick={() =>
                                        setOpenModule(isOpen ? null : moduleId)
                                    }
                                    className="p-4 flex justify-between items-center cursor-pointer hover:bg-slate-800/40 transition"
                                >
                                    <div className="flex gap-3 items-center">
                                        <Layers className="text-blue-400" size={18} />
                                        <span className="font-medium">{module.title}</span>
                                    </div>
                                    <ChevronDown className={`transition ${isOpen ? "rotate-180" : ""}`} />
                                </div>

                                {isOpen && (
                                    <div className="p-4 flex flex-col gap-3 border-t border-slate-800">

                                        <DndContext
                                            sensors={sensors}
                                            collisionDetection={closestCenter}
                                            onDragEnd={(e) => handleDragEnd(e, module)}
                                        >
                                            <SortableContext
                                                items={module.contents.map(c => getId(c))}
                                                strategy={verticalListSortingStrategy}
                                            >
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
                                            </SortableContext>
                                        </DndContext>

                                        <div className="flex gap-2 mt-2 flex-wrap">
                                            {["text", "image", "video", "file", "youtube"].map(type => (
                                                <button
                                                    key={type}
                                                    onClick={() => addContent(module, type as ContentType)}
                                                    className="text-xs bg-slate-700/80 hover:bg-slate-600 px-3 py-1.5 rounded-lg transition"
                                                >
                                                    + {type}
                                                </button>
                                            ))}
                                        </div>

                                    </div>
                                )}

                            </div>
                        );
                    })}

                </div>
            </div>
        </AppLayout>
    );
}