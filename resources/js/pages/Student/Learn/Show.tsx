import React, { useEffect } from "react";
import { router } from "@inertiajs/react";
import { show as learnShow } from "@/actions/App/Http/Controllers/Student/LearnController";

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
    final_quiz?: {
        id: string;
    };
};

type Course = {
    _id: string;
    title: string;
};

type Progress = {
    completed_modules: string[];
};

/* ================= PAGE ================= */
export default function LearnShow({
    course,
    path,
    module,
    progress
}: {
    course: Course;
    path: Path;
    module: Module;
    progress: Progress;
}) {

    /* ================= SORT MODULES ================= */
    const modules = [...path.modules].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    /* ================= INDEX ================= */
    const currentIndex = modules.findIndex(m => m._id === module._id);

    if (currentIndex === -1) {
        return (
            <div className="text-white p-10">
                Module tidak ditemukan / tidak valid
            </div>
        );
    }

    const prevModule = modules[currentIndex - 1];
    const nextModule = modules[currentIndex + 1];

    /* ================= PROGRESS ================= */
    const completedModules = progress?.completed_modules || [];

    const isCompleted = (id: string) =>
        completedModules.includes(id);

    const isUnlocked = (index: number) => {
        if (index === 0) return true;
        return isCompleted(modules[index - 1]._id);
    };

    // 🔥 FIX UTAMA
    const allCompleted = modules.every(m =>
        isCompleted(m._id)
    );

    const isLastModule = currentIndex === modules.length - 1;

    /* ================= QUIZ ================= */
    const finalQuizId = path.final_quiz?.id;

    /* ================= NAVIGATION ================= */
    const goToModule = (mod: Module) => {
        router.visit(learnShow.url([course._id, path._id, mod._id]));
    };

    /* ================= COMPLETE MODULE ================= */
    const completeModule = () => {
        router.post(`/student/modules/${module._id}/complete`, {
            path_id: path._id,
            course_id: course._id
        }, {
            preserveScroll: true,
            onSuccess: () => {
                router.reload(); // refresh progress
            }
        });
    };

    /* ================= AUTO SCROLL ================= */
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [module]);

    /* ================= YOUTUBE ================= */
    const getYoutubeEmbedUrl = (url?: string) => {
        if (!url) return "";
        try {
            let videoId = "";
            if (url.includes("youtu.be/")) {
                videoId = url.split("youtu.be/")[1]?.split(/[?#]/)[0];
            } else if (url.includes("youtube.com/watch")) {
                const urlParams = new URL(url).searchParams;
                videoId = urlParams.get("v") || "";
            } else if (url.includes("youtube.com/embed/")) {
                videoId = url.split("youtube.com/embed/")[1]?.split(/[?#]/)[0];
            }
            return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
        } catch {
            return url;
        }
    };

    return (
        <div className="min-h-screen bg-[#040812] text-white flex flex-col">

            {/* ================= HEADER ================= */}
            <div className="relative w-full px-4 py-4 mb-2">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600"></div>

                <h1 className="text-center font-['Orbitron'] text-lg sm:text-xl tracking-widest uppercase">
                    {course.title}
                </h1>
            </div>

            {/* ================= MAIN ================= */}
            <div className="flex flex-1 gap-4 px-4 pb-4">

                {/* ================= LEFT PANEL ================= */}
                <div className="w-[260px] sm:w-[300px] border border-blue-500 rounded-xl p-4 flex flex-col items-center">

                    <div className="flex flex-col items-center gap-6">

                        {modules.map((mod, index) => {
                            const isActive = module._id === mod._id;
                            const unlocked = isUnlocked(index);
                            const done = isCompleted(mod._id);

                            return (
                                <div
                                    key={`mod_${index}`}
                                    onClick={() => unlocked && goToModule(mod)}
                                    className={`flex flex-col items-center ${unlocked ? "cursor-pointer" : "opacity-40 pointer-events-none"
                                        }`}
                                >
                                    <button
                                        className={`
                                            w-38 rounded-2xl p-4 text-center
                                            transition-all duration-300
                                            backdrop-blur bg-white/5 border border-white/10
                                            ${unlocked ? "hover:scale-105 hover:bg-white/10 active:scale-95" : ""}
                                            ${isActive ? "border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.4)]" : ""}
                                            ${done ? "border-green-500" : ""}
                                        `}
                                    >
                                        <p className={`text-xs font-medium tracking-wide w-32 ${isActive ? "text-yellow-300" : "text-gray-400"
                                            }`}>
                                            {mod.title}
                                        </p>
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* ================= RIGHT PANEL ================= */}
                <div className="flex-1 flex flex-col">

                    {/* CONTENT */}
                    <div className="flex-1 border border-blue-500 rounded-xl p-6 overflow-y-auto">

                        <h2 className="text-xl font-bold mb-6">
                            {module.title}
                        </h2>

                        {module.contents.length === 0 && (
                            <p className="text-gray-400">
                                Belum ada materi.
                            </p>
                        )}

                        {module.contents.map((item, index) => (
                            <div key={`content_${index}`} className="mb-8 p-5 bg-gray-800/30 rounded-xl border border-gray-700/50 shadow-sm">

                                {item.type === "text" && (
                                    <div className="flex flex-col gap-3">
                                        {item.content?.title && (
                                            <h3 className="text-lg font-bold text-blue-400">
                                                {item.content.title}
                                            </h3>
                                        )}
                                        <p className="text-gray-200 whitespace-pre-wrap text-[15px]">
                                            {item.content?.description || item.content?.text}
                                        </p>
                                    </div>
                                )}

                                {item.type === "youtube" && (
                                    <iframe
                                        src={getYoutubeEmbedUrl(item.content.url)}
                                        className="w-full h-[400px]"
                                        allowFullScreen
                                    />
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
                                    <a href={item.content.url} target="_blank" className="text-blue-400 underline">
                                        Download File
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* ================= FOOTER ================= */}
                    <div className="mt-4 flex items-center justify-between">

                        <div className="flex gap-2">
                            {prevModule && (
                                <button onClick={() => goToModule(prevModule)}>← Prev</button>
                            )}
                            {nextModule && (
                                <button onClick={() => goToModule(nextModule)}>Next →</button>
                            )}
                        </div>

                        {/* COMPLETE */}
                        {!isCompleted(module._id) && (
                            <button
                                onClick={completeModule}
                                className="bg-green-500 px-4 py-2 rounded hover:scale-105 transition"
                            >
                                Tandai Selesai
                            </button>
                        )}

                        {/* 🔥 FINAL TEST FIX */}
                        {isLastModule && finalQuizId && allCompleted && (
                            <button
                                onClick={() => router.visit(`/student/quiz/${finalQuizId}`)}
                                className="bg-yellow-400 text-black px-6 py-2 rounded-lg font-bold hover:scale-105 transition"
                            >
                                🎯 FINAL TEST
                            </button>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}