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
    quiz?: {
        id: string;
    };
};

type Path = {
    _id: string;
    name: string;
    modules: Module[];
};

type Course = {
    _id: string;
    title: string;
};

/* ================= PAGE ================= */
export default function LearnShow({
    course,
    path,
    module,
}: {
    course: Course;
    path: Path;
    module: Module;
}) {

    /* ================= NAVIGATION ================= */
    const goToModule = (mod: Module) => {
        router.visit(learnShow.url([course._id, path._id, mod._id]));
    };

    /* ================= AUTO SCROLL ================= */
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [module]);

    /* ================= NEXT / PREV ================= */
    const currentIndex = path.modules.findIndex(m => m._id === module._id);

    const prevModule = path.modules[currentIndex - 1];
    const nextModule = path.modules[currentIndex + 1];

    /* ================= YOUTUBE EMBED HELPER ================= */
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
        } catch (e) {
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

                        {path.modules.map((mod, index) => {
                            const isActive = module._id === mod._id;

                            return (
                                <div
                                    key={`mod_${index}`}
                                    onClick={() => goToModule(mod)}
                                    className="flex flex-col items-center cursor-pointer"
                                >
                                    {/* NODE */}
                                    {/* <div
                                        className={`
                                            w-20 h-20 rounded-xl flex items-center justify-center
                                            transition-all duration-300
                                            ${isActive
                                                ? "bg-yellow-400 text-black scale-110 shadow-[0_0_25px_rgba(255,200,0,0.8)]"
                                                : "bg-gray-700 hover:bg-gray-600"
                                            }
                                        `}
                                    >
                                        ⚔️
                                    </div> */}

                                    {/* TITLE */}
                                    <button
                                        className={`
                                        w-38 rounded-2xl p-4 text-center
                                        transition-all duration-300
                                        backdrop-blur bg-white/5 border border-white/10
                                        hover:scale-105 hover:bg-white/10 active:scale-95
                                        ${isActive ? "border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.4)]" : ""}`}>
                                        {/* Title */}
                                        <p
                                            className={`
       text-xs font-medium tracking-wide w-32
      ${isActive ? "text-yellow-300" : "text-gray-400"}
    `}
                                        >
                                            {mod.title}
                                        </p>
                                    </button>

                                    {/* LINE */}
                                    {/* {index !== path.modules.length - 1 && (
                                        <div className="w-[2px] h-10 bg-gray-600 mt-2"></div>
                                    )} */}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* ================= RIGHT PANEL ================= */}
                <div className="flex-1 flex flex-col">

                    {/* CONTENT BOX */}
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
                                            <h3 className="text-lg font-bold text-blue-400">{item.content.title}</h3>
                                        )}
                                        {/* text whitespace-pre-wrap to support paragraphs and long text */}
                                        {item.content?.description && (
                                            <p className="text-gray-200 leading-relaxed whitespace-pre-wrap text-[15px]">
                                                {item.content.description}
                                            </p>
                                        )}
                                        {/* Fallback compatible with old string schema */}
                                        {item.content?.text && (
                                            <p className="text-gray-200 leading-relaxed whitespace-pre-wrap text-[15px]">
                                                {item.content.text}
                                            </p>
                                        )}
                                    </div>
                                )}

                                {item.type === "youtube" && (
                                    <div className="rounded-lg overflow-hidden border border-gray-600 bg-black/50 w-full mt-2">
                                        {/* Transform regular youtube url to embed format if needed, but assuming url is already embed format */}
                                        <iframe
                                            src={getYoutubeEmbedUrl(item.content.url)}
                                            className="w-full h-[300px] sm:h-[400px]"
                                            allowFullScreen
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        />
                                    </div>
                                )}

                                {item.type === "image" && (
                                    <div className="rounded-lg overflow-hidden border border-gray-600 flex justify-center bg-black/50 p-2 mt-2">
                                        <img
                                            src={item.content.url}
                                            alt={item.content.name || "Module Image"}
                                            className="max-w-full h-auto object-contain rounded"
                                        />
                                    </div>
                                )}

                                {item.type === "video" && (
                                    <div className="rounded-lg overflow-hidden border border-gray-600 bg-black mt-2">
                                        <video
                                            controls
                                            controlsList="nodownload"
                                            className="w-full max-h-[500px]"
                                            src={item.content.url}
                                        >
                                            Browser Anda tidak mendukung tag video.
                                        </video>
                                    </div>
                                )}

                                {item.type === "file" && (
                                    <a
                                        href={item.content.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center gap-4 p-4 border border-blue-500/50 bg-blue-900/20 rounded-lg hover:bg-blue-900/40 transition group mt-2 w-max min-w-[250px]"
                                    >
                                        <div className="w-12 h-12 bg-blue-600 rounded flex items-center justify-center group-hover:scale-105 transition-transform flex-shrink-0">
                                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <div className="flex flex-col truncate">
                                            <span className="text-white font-bold truncate max-w-[200px]">{item.content.name || "Download File"}</span>
                                            {item.content.size && (
                                                <span className="text-xs text-blue-300">{(item.content.size / 1024 / 1024).toFixed(2)} MB</span>
                                            )}
                                        </div>
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* ================= FOOTER ================= */}
                    <div className="mt-4 flex items-center justify-between">

                        {/* PREV / NEXT */}
                        <div className="flex gap-2">
                            {prevModule && (
                                <button
                                    onClick={() => goToModule(prevModule)}
                                    className="px-4 py-2 border border-gray-600 rounded hover:bg-gray-700"
                                >
                                    ← Prev
                                </button>
                            )}

                            {nextModule && (
                                <button
                                    onClick={() => goToModule(nextModule)}
                                    className="px-4 py-2 border border-gray-600 rounded hover:bg-gray-700"
                                >
                                    Next →
                                </button>
                            )}
                        </div>

                        {/* ACTION */}
                        {module.quiz && (
                            <button
                                onClick={() => router.visit(`/student/quiz/${module.quiz!.id}`)}
                                className="bg-yellow-400 text-black px-6 py-2 rounded-lg font-bold hover:scale-105 transition"
                            >
                                MULAI TEST
                            </button>
                        )}
                    </div>

                    {/* DESKRIPSI */}
                    <p className="text-gray-400 text-sm mt-2">
                        DESKRIPSI MODULE
                    </p>
                </div>
            </div>
        </div>
    );
}