import React, { useEffect } from "react";
import { router, Link } from "@inertiajs/react";
import { Lock, Check, Play, FileText } from 'lucide-react';
import { show as learnShow } from "@/actions/App/Http/Controllers/Student/LearnController";
import { ArrowLeft } from "lucide-react";


/* ================= TYPES ================= */
type Content = {
    _id: string;
    type: "text" | "youtube" | "image" | "video" | "file" | string;
    content: any;
};

type Module = {
    _id: string;
    title: string;
    contents: Content[];
    order?: number;
};

type Path = {
    _id: string;
    name: string;
    modules: Module[];
    final_quiz?: { id: string };
};

type Course = {
    _id: string;
    title: string;
    slug: string;
};

type Progress = {
    completed_modules: string[];
};

/* ================= PAGE ================= */
export default function LearnShow({
    course, path, module, progress
}: {
    course: Course;
    path: Path;
    module: Module;
    progress: Progress;
}) {
    const modules = [...path.modules].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    const currentIndex = modules.findIndex(m => m._id === module._id);

    if (currentIndex === -1) {
        return <div className="text-white p-10">Module tidak ditemukan / tidak valid</div>;
    }

    const prevModule = modules[currentIndex - 1];
    const nextModule = modules[currentIndex + 1];
    const completedModules = progress?.completed_modules || [];
    const isCompleted = (id: string) => completedModules.includes(id);
    const isUnlocked = (index: number) => index === 0 || isCompleted(modules[index - 1]._id);
    const allCompleted = modules.every(m => isCompleted(m._id));
    const isLastModule = currentIndex === modules.length - 1;
    const finalQuizId = path.final_quiz?.id;

    const goToModule = (mod: Module) => {
        router.visit(learnShow.url([course._id, path._id, mod._id]));
    };

    const completeModule = () => {
        router.post(`/student/modules/${module._id}/complete`, {
            path_id: path._id,
            course_id: course._id
        }, {
            preserveScroll: true,
            onSuccess: () => router.reload(),
        });
    };

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [module]);

    const getYoutubeEmbedUrl = (url?: string) => {
        if (!url) return "";
        try {
            let videoId = "";
            if (url.includes("youtu.be/")) {
                videoId = url.split("youtu.be/")[1]?.split(/[?#]/)[0];
            } else if (url.includes("youtube.com/watch")) {
                videoId = new URL(url).searchParams.get("v") || "";
            } else if (url.includes("youtube.com/embed/")) {
                videoId = url.split("youtube.com/embed/")[1]?.split(/[?#]/)[0];
            }
            return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
        } catch {
            return url;
        }
    };

    return (
        // ROOT: h-screen + overflow-hidden = tidak ada scroll di luar
        <div className="h-screen bg-[#040812] text-white flex flex-col overflow-hidden">


            <div className="flex-shrink-0 w-full pt-0.5 px-1">
                <div
                    className="relative border-[2px] md:border-[3px]"
                    style={{
                        borderImage: "linear-gradient(to bottom, #3B28F6 0%, #4c2fff 30%, #7c3aed 50%, #facc15 100%) 1",
                    }}
                >
                    <div className="py-4 px-4 md:px-6 flex items-center gap-4 bg-[#040812]">
                        <Link
                            href={`/student/courses/${course.slug}`}
                            className="border-2 border-blue-800 rounded bg-[#0b1021] flex items-center justify-center p-2 hover:bg-blue-900/40 hover:border-blue-600 transition-colors w-10 h-10 md:w-12 md:h-12 shrink-0"
                        >
                            <svg viewBox="0 0 48 48" className="w-7 h-7 md:w-9 md:h-9 text-indigo-500">
                                <rect x="12" y="20" width="29" height="4" fill="currentColor" />
                                <rect x="8" y="20" width="4" height="4" fill="currentColor" />
                                <rect x="5" y="20" width="5" height="4" fill="currentColor" />
                                <rect x="8" y="16" width="4" height="4" fill="currentColor" />
                                <rect x="8" y="24" width="4" height="4" fill="currentColor" />
                                <rect x="12" y="12" width="4" height="4" fill="currentColor" />
                                <rect x="12" y="28" width="4" height="4" fill="currentColor" />
                                <rect x="16" y="8" width="4" height="4" fill="currentColor" />
                                <rect x="16" y="32" width="4" height="4" fill="currentColor" />
                            </svg>
                        </Link>
                        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-white tracking-[0.15em] uppercase font-['Orbitron']">
                            {course.title}
                        </h1>
                    </div>
                </div>

            {/* ================= HEADER ================= */}
          

            {/* ================= MAIN (flex-1 + overflow-hidden) ================= */}
            {/* flex-1 mengisi sisa tinggi, overflow-hidden mencegah main ikut scroll */}
            <div className="flex flex-1 gap-2 px-1 pb-1 pt-2 overflow-hidden min-h-0">

                {/* ================= LEFT PANEL (DIAM) ================= */}
                {/* flex-shrink-0 + overflow-hidden = sidebar tidak bisa scroll keluar */}
                <div
                    className="w-[260px] sm:w-[280px] flex-shrink-0 rounded-xl p-3 flex flex-col gap-2 overflow-hidden"
                    style={{
                        background: "linear-gradient(180deg, #0d1229 0%, #080d1e 100%)",
                        border: "1px solid rgba(99,130,255,0.3)",
                    }}
                >
                    {/* Label header sidebar — tidak scroll */}
                    <p
                        className="flex-shrink-0 text-xs font-bold tracking-[0.2em] text-gray-400 uppercase px-1"
                        style={{ fontFamily: "Orbitron, sans-serif" }}
                    >
                        Quest Modules
                    </p>

                    {/* List modul — HANYA ini yang scroll di dalam sidebar */}
                    <div
                        className="flex flex-col gap-2 overflow-y-auto flex-1 min-h-0 pr-1"
                        style={{
                            scrollbarWidth: "thin",
                            scrollbarColor: "rgba(99,130,255,0.3) transparent",
                        }}
                    >
                        {modules.map((mod, index) => {
                            const isActive = module._id === mod._id;
                            const unlocked = isUnlocked(index);
                            const done = isCompleted(mod._id);

                            return (
                                <div
                                    key={`mod_${index}`}
                                    onClick={() => unlocked && goToModule(mod)}
                                    className={`relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 ${unlocked ? "cursor-pointer" : "cursor-not-allowed"}`}
                                    style={{
                                        background: isActive
                                            ? "linear-gradient(135deg, #1a2060 0%, #0e1540 100%)"
                                            : done
                                            ? "linear-gradient(135deg, #0a2a1a 0%, #0d1f2d 100%)"
                                            : "rgba(255,255,255,0.03)",
                                        border: isActive
                                            ? "1px solid rgba(99,130,255,0.8)"
                                            : done
                                            ? "1px solid rgba(74,222,128,0.5)"
                                            : "1px solid rgba(255,255,255,0.06)",
                                        boxShadow: isActive
                                            ? "0 0 16px rgba(99,130,255,0.2)"
                                            : done
                                            ? "0 0 10px rgba(74,222,128,0.1)"
                                            : "none",
                                        opacity: !unlocked ? 0.4 : 1,
                                    }}
                                >
                                    {/* Icon Box */}
                                    <div
                                        className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                                        style={{
                                            background: isActive
                                                ? "rgba(99,130,255,0.2)"
                                                : done
                                                ? "rgba(74,222,128,0.15)"
                                                : "rgba(255,255,255,0.05)",
                                            border: isActive
                                                ? "1px solid rgba(99,130,255,0.6)"
                                                : done
                                                ? "1px solid rgba(74,222,128,0.4)"
                                                : "1px solid rgba(255,255,255,0.08)",
                                        }}
                                    >
                                        {!unlocked ? (
                                            <Lock className="w-4 h-4 text-gray-500" />
                                        ) : done ? (
                                            <Check className="w-4 h-4 text-green-400" />
                                        ) : isActive ? (
                                            <Play className="w-4 h-4 text-indigo-300" fill="currentColor" />
                                        ) : (
                                            <span className="text-xs font-bold text-gray-400" style={{ fontFamily: "Orbitron, sans-serif" }}>
                                                {String(index + 1).padStart(2, "0")}
                                            </span>
                                        )}
                                    </div>

                                    {/* Text */}
                                    <div className="flex flex-col min-w-0">
                                        <span
                                            className="text-[10px] font-semibold tracking-widest uppercase mb-0.5"
                                            style={{
                                                fontFamily: "Orbitron, sans-serif",
                                                color: isActive ? "#6382ff" : done ? "#4ade80" : "rgba(255,255,255,0.3)",
                                            }}
                                        >
                                            Modul {String(index + 1).padStart(2, "0")}
                                        </span>
                                        <span
                                            className="text-sm font-bold leading-tight truncate"
                                            style={{
                                                color: isActive ? "#ffffff" : done ? "#a7f3d0" : unlocked ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.3)",
                                            }}
                                        >
                                            {mod.title}
                                        </span>
                                    </div>

                                    {isActive && (
                                        <div
                                            className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full"
                                            style={{ background: "linear-gradient(to bottom, #99E4FD, #9681FF)" }}
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* ================= RIGHT PANEL ================= */}
                {/* flex-1 + min-h-0 + overflow-hidden = kanan mengisi sisa, tidak bocor */}
                <div className="flex-1 flex flex-col gap-2 overflow-hidden min-h-0">

                    {/* KONTEN — HANYA INI YANG SCROLL */}
                    <div
                        className="flex-1 min-h-0 rounded-xl overflow-y-auto p-5"
                        style={{
                            background: "linear-gradient(180deg, #0d1229 0%, #080d1e 100%)",
                            border: "1px solid rgba(99,130,255,0.3)",
                            scrollbarWidth: "thin",
                            scrollbarColor: "rgba(99,130,255,0.3) transparent",
                        }}
                    >
                        <h2 className="text-xl font-bold mb-4 text-white" style={{ fontFamily: "Orbitron, sans-serif" }}>
                            {module.title}
                        </h2>

                        {module.contents.length === 0 && (
                            <p className="text-gray-400">Belum ada materi.</p>
                        )}

                        {module.contents.map((item, index) => (
                            <div
                                key={`content_${index}`}
                                className="mb-6 rounded-xl overflow-hidden"
                                style={{
                                    border: "1px solid rgba(99,130,255,0.2)",
                                    background: "rgba(255,255,255,0.02)",
                                }}
                            >
                                {item.type === "text" && (
                                    <div className="flex flex-col gap-3 p-5">
                                        {item.content?.title && (
                                            <h3 className="text-lg font-bold text-blue-400">{item.content.title}</h3>
                                        )}

                                        <p className="text-gray-200 whitespace-pre-wrap text-[15px] leading-relaxed">

                                            {item.content?.description || item.content?.text}
                                        </p>
                                    </div>
                                )}
                                {item.type === "youtube" && (
                                    <iframe src={getYoutubeEmbedUrl(item.content.url)} className="w-full h-[400px]" allowFullScreen />
                                )}
                                {item.type === "image" && (
                                    <img src={item.content.url} className="w-full rounded" />
                                )}
                                {item.type === "video" && (
                                    <video controls className="w-full">
                                        <source src={item.content.url} />
                                    </video>
                                )}
                                {item.type === "file" && (
                                    <div className="p-5 flex items-center gap-3">
                                        <div
                                            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                                            style={{ background: "rgba(99,130,255,0.15)", border: "1px solid rgba(99,130,255,0.4)" }}
                                        >
                                            <FileText className="w-5 h-5 text-indigo-400" />
                                        </div>
                                        <div>
                                            <p className="text-white text-sm font-semibold">Download File</p>
                                            <a href={item.content.url} target="_blank" className="text-blue-400 text-xs underline">
                                                {item.content.url}
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* ================= FOOTER (DIAM) ================= */}
                    <div className="flex-shrink-0 flex items-center justify-between">
                        <div className="flex gap-2">
                            {prevModule && (
                                <button
                                    onClick={() => goToModule(prevModule)}
                                    className="px-4 py-2 rounded-lg text-sm font-bold text-white transition-all hover:brightness-110"
                                    style={{
                                        background: "rgba(255,255,255,0.05)",
                                        border: "1px solid rgba(255,255,255,0.15)",
                                        fontFamily: "Orbitron, sans-serif",
                                    }}
                                >
                                    ← Prev
                                </button>
                            )}
                            {nextModule && (
                                <button
                                    onClick={() => goToModule(nextModule)}
                                    className="px-4 py-2 rounded-lg text-sm font-bold text-white transition-all hover:brightness-110"
                                    style={{
                                        background: "rgba(99,130,255,0.1)",
                                        border: "1px solid rgba(99,130,255,0.4)",
                                        fontFamily: "Orbitron, sans-serif",
                                    }}
                                >
                                    Next Module
                                </button>
                            )}
                        </div>

                        <div className="flex gap-2">
                            {!isCompleted(module._id) && (
                                <button
                                    onClick={completeModule}
                                    className="px-5 py-2 rounded-lg text-sm font-bold transition-all hover:brightness-110"
                                    style={{
                                        background: "rgba(74,222,128,0.15)",
                                        border: "1px solid rgba(74,222,128,0.5)",
                                        color: "#4ade80",
                                        fontFamily: "Orbitron, sans-serif",
                                    }}
                                >
                                    ✓ Tandai Selesai
                                </button>
                            )}
                            {isLastModule && finalQuizId && allCompleted && (
                                <button
                                    onClick={() => router.visit(`/student/quiz/${finalQuizId}`)}
                                    className="px-6 py-2 rounded-lg font-bold text-sm transition-all hover:brightness-110"
                                    style={{
                                        background: "#F0C419",
                                        color: "#020202",
                                        fontFamily: "Orbitron, sans-serif",
                                        boxShadow: "0 0 16px rgba(240,196,25,0.4)",
                                    }}
                                >
                                    MULAI TEST →
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>
    );
}