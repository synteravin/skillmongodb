import React, { useEffect } from 'react';
import { router, Link } from '@inertiajs/react';
import { Lock, Check, Play, FileText, X, ZoomIn } from 'lucide-react';

/* ================= TYPES ================= */
type Content = {
    _id: string;
    type: 'text' | 'youtube' | 'image' | 'video' | 'file' | string;
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
    course,
    path,
    module,
    progress,
}: {
    course: Course;
    path: Path;
    module: Module;
    progress: Progress;
}) {
    const modules = [...path.modules].sort(
        (a, b) => (a.order ?? 0) - (b.order ?? 0),
    );
    const currentIndex = modules.findIndex((m) => m._id === module._id);

    if (currentIndex === -1) {
        return (
            <div className="p-10 text-white">
                Module tidak ditemukan / tidak valid
            </div>
        );
    }

    const prevModule = modules[currentIndex - 1];
    const nextModule = modules[currentIndex + 1];
    const completedModules = progress?.completed_modules || [];
    const isCompleted = (id: string) => completedModules.includes(id);
    const isUnlocked = (index: number) =>
        index === 0 || isCompleted(modules[index - 1]._id);
    const allCompleted = modules.every((m) => isCompleted(m._id));
    const isLastModule = currentIndex === modules.length - 1;
    const finalQuizId = path.final_quiz?.id;

    const goToModule = (mod: Module) => {
        router.visit(`/student/learn/${course._id}/${path._id}/${mod._id}`);
    };

    const completeModule = () => {
        router.post(
            `/student/modules/${module._id}/complete`,
            {
                path_id: path._id,
                course_id: course._id,
            },
            {
                preserveScroll: true,
                onSuccess: () => router.reload(),
            },
        );
    };

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [module]);

    const getYoutubeEmbedUrl = (url?: string) => {
        if (!url) return '';
        try {
            let videoId = '';
            if (url.includes('youtu.be/')) {
                videoId = url.split('youtu.be/')[1]?.split(/[?#]/)[0];
            } else if (url.includes('youtube.com/watch')) {
                videoId = new URL(url).searchParams.get('v') || '';
            } else if (url.includes('youtube.com/embed/')) {
                videoId = url.split('youtube.com/embed/')[1]?.split(/[?#]/)[0];
            }
            return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
        } catch {
            return url;
        }
    };

    return (
        <div className="flex h-screen flex-col overflow-hidden bg-[#040812] text-white">
            {/* ================= HEADER (DIAM) ================= */}
            <div className="w-full flex-shrink-0 px-1 pt-0.5">
                <div
                    className="relative border-[2px] md:border-[3px] border-transparent"
                    style={{
                        borderImage:
                            'linear-gradient(to right, #3B28F6 0%, #4c2fff 30%, #7c3aed 50%, #facc15 100%) 1',
                    }}
                >
                    <div className="flex items-center gap-4 bg-[#040812] px-4 py-4 md:px-6">
                        <Link
                            href={`/student/courses/${course.slug}`}
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded border-2 border-blue-800 bg-[#0b1021] p-2 transition-colors hover:border-blue-600 hover:bg-blue-900/40 md:h-12 md:w-12"
                        >
                            <svg
                                viewBox="0 0 48 48"
                                className="h-7 w-7 scale-125 text-indigo-500 transition-transform duration-200 hover:scale-150 md:h-9 md:w-9"
                            >
                                <rect
                                    x="12"
                                    y="20"
                                    width="29"
                                    height="4"
                                    fill="currentColor"
                                />
                                <rect
                                    x="8"
                                    y="20"
                                    width="4"
                                    height="4"
                                    fill="currentColor"
                                />
                                <rect
                                    x="5"
                                    y="20"
                                    width="5"
                                    height="4"
                                    fill="currentColor"
                                />
                                <rect
                                    x="8"
                                    y="16"
                                    width="4"
                                    height="4"
                                    fill="currentColor"
                                />
                                <rect
                                    x="8"
                                    y="24"
                                    width="4"
                                    height="4"
                                    fill="currentColor"
                                />
                                <rect
                                    x="12"
                                    y="12"
                                    width="4"
                                    height="4"
                                    fill="currentColor"
                                />
                                <rect
                                    x="12"
                                    y="28"
                                    width="4"
                                    height="4"
                                    fill="currentColor"
                                />
                                <rect
                                    x="16"
                                    y="8"
                                    width="4"
                                    height="4"
                                    fill="currentColor"
                                />
                                <rect
                                    x="16"
                                    y="32"
                                    width="4"
                                    height="4"
                                    fill="currentColor"
                                />
                            </svg>
                        </Link>
                        <h1 className="font-['Orbitron'] text-xl font-bold tracking-[0.15em] text-white uppercase md:text-2xl lg:text-3xl">
                            {course.title}
                        </h1>
                    </div>
                </div>
            </div>

            {/* ================= MAIN (flex-1 + overflow-hidden) ================= */}
            <div className="flex min-h-0 flex-1 flex-col md:flex-row gap-2 overflow-hidden px-1 pt-2 pb-1">
                {/* ================= LEFT PANEL (DIAM) ================= */}
                <div className="flex w-full md:w-[260px] lg:w-[280px] md:flex-shrink-0 flex-col gap-2 overflow-hidden rounded-xl p-3 bg-gradient-to-b from-[#0d1229] to-[#080d1e] border border-blue-500/30">
                    {/* Label header sidebar */}
                    <p className="flex-shrink-0 px-1 text-xs font-bold tracking-[0.2em] text-gray-400 uppercase font-['Orbitron']">
                        Quest Modules
                    </p>

                    {/* List modul */}
                    <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-blue-500/30 scrollbar-track-transparent">
                        {modules.map((mod, index) => {
                            const isActive = module._id === mod._id;
                            const unlocked = isUnlocked(index);
                            const done = isCompleted(mod._id);

                            return (
                                <div
                                    key={`mod_${index}`}
                                    onClick={() => unlocked && goToModule(mod)}
                                    className={`relative flex items-center gap-3 rounded-xl px-3 py-3 transition-all duration-300 ${
                                        unlocked ? 'cursor-pointer' : 'cursor-not-allowed opacity-40'
                                    } ${
                                        isActive 
                                            ? 'bg-gradient-to-br from-[#1a2060] to-[#0e1540] border border-blue-500/80 shadow-[0_0_16px_rgba(99,130,255,0.2)]'
                                            : done
                                                ? 'bg-gradient-to-br from-[#0a2a1a] to-[#0d1f2d] border border-green-500/50 shadow-[0_0_10px_rgba(74,222,128,0.1)]'
                                                : 'bg-white/5 border border-white/5'
                                    }`}
                                >
                                    {/* Icon Box */}
                                    <div
                                        className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border ${
                                            isActive
                                                ? 'bg-blue-500/20 border-blue-500/60'
                                                : done
                                                    ? 'bg-green-500/15 border-green-500/40'
                                                    : 'bg-white/5 border-white/10'
                                        }`}
                                    >
                                        {!unlocked ? (
                                            <Lock className="h-4 w-4 text-gray-500" />
                                        ) : done ? (
                                            <Check className="h-4 w-4 text-green-400" />
                                        ) : isActive ? (
                                            <Play
                                                className="h-4 w-4 text-indigo-300"
                                                fill="currentColor"
                                            />
                                        ) : (
                                            <span className="text-xs font-bold text-gray-400 font-['Orbitron']">
                                                {String(index + 1).padStart(2, '0')}
                                            </span>
                                        )}
                                    </div>

                                    {/* Text */}
                                    <div className="flex min-w-0 flex-col">
                                        <span
                                            className={`mb-0.5 text-[10px] font-semibold tracking-widest uppercase font-['Orbitron'] ${
                                                isActive ? 'text-blue-400' : done ? 'text-green-400' : 'text-white/30'
                                            }`}
                                        >
                                            Modul {String(index + 1).padStart(2, '0')}
                                        </span>
                                        <span
                                            className={`truncate text-sm leading-tight font-bold ${
                                                isActive ? 'text-white' : done ? 'text-green-200' : unlocked ? 'text-white/60' : 'text-white/30'
                                            }`}
                                        >
                                            {mod.title}
                                        </span>
                                    </div>

                                    {isActive && (
                                        <div className="absolute top-2 bottom-2 left-0 w-[3px] rounded-full bg-gradient-to-b from-[#99E4FD] to-[#9681FF]" />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* ================= RIGHT PANEL ================= */}
                <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden">
                    <div className="min-h-0 flex-1 overflow-y-auto rounded-xl p-4 md:p-6 lg:p-8 bg-gradient-to-b from-[#0d1229] to-[#080d1e] border border-blue-500/30 scrollbar-thin scrollbar-thumb-blue-500/30 scrollbar-track-transparent">
                        {/* Module Title */}
                        <div className="mb-6 flex items-center gap-3">
                            <div className="w-[3px] h-6 rounded-full bg-gradient-to-b from-blue-400 to-purple-400" />
                            <h2 className="text-lg md:text-xl font-bold text-white tracking-widest font-['Orbitron']">
                                {module.title}
                            </h2>
                        </div>

                        {module.contents.length === 0 && (
                            <p className="text-sm text-gray-500 italic">
                                Belum ada materi.
                            </p>
                        )}

                        {module.contents.map((item, index) => (
                            <div key={`content_${index}`} className="mb-1">
                                {/* ── TEXT ── */}
                                {item.type === 'text' && (
                                    <div className="mb-5">
                                        {item.content?.title && (
                                            <div className="mb-2 flex items-center gap-2">
                                                <span className="rounded px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase bg-blue-500/15 text-blue-400 border border-blue-500/30">
                                                    {String(index + 1).padStart(2, '0')}
                                                </span>
                                                <h3 className="text-base font-bold text-blue-300 font-['Orbitron']">
                                                    {item.content.title}
                                                </h3>
                                            </div>
                                        )}
                                        <p className="text-[14px] md:text-[15px] leading-relaxed whitespace-pre-wrap text-gray-300 pl-6 border-l-2 border-blue-500/20">
                                            {item.content?.description || item.content?.text}
                                        </p>
                                    </div>
                                )}

                                {/* ── YOUTUBE ── */}
                                {item.type === 'youtube' && (
                                    <div className="mb-5 overflow-hidden rounded-xl border border-blue-500/20 shadow-lg shadow-black/50">
                                        <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 border-b border-blue-500/20">
                                            <span className="h-2 w-2 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]" />
                                            <span className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase">
                                                Video
                                            </span>
                                        </div>
                                        <div className="aspect-video w-full">
                                            <iframe
                                                src={getYoutubeEmbedUrl(item.content.url)}
                                                className="w-full h-full block"
                                                allowFullScreen
                                            />
                                        </div>
                                    </div>
                                )}
                                {/* ── IMAGE ── */}
                                {item.type === 'image' &&
                                    (() => {
                                        const [isOpen, setIsOpen] =
                                            React.useState(false);
                                        return (
                                            <>
                                                {/* Lightbox Modal */}
                                                {isOpen && (
                                                    <div
                                                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md"
                                                        onClick={() => setIsOpen(false)}
                                                    >
                                                        <div
                                                            className="relative mx-4 w-full max-w-4xl"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            {/* Close button */}
                                                            <button
                                                                onClick={() => setIsOpen(false)}
                                                                className="absolute -top-10 right-0 flex items-center gap-1.5 text-gray-400 transition-colors hover:text-white"
                                                            >
                                                                <X className="h-4 w-4" />
                                                                <span className="text-xs tracking-wider uppercase font-['Orbitron']">
                                                                    Tutup
                                                                </span>
                                                            </button>

                                                            {/* Image */}
                                                            <div className="overflow-hidden rounded-xl border border-blue-500/40 shadow-[0_0_60px_rgba(59,130,246,0.2)]">
                                                                <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 border-b border-blue-500/30">
                                                                    <span className="h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_8px_#60a5fa]" />
                                                                    <span className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase">
                                                                        Image Preview
                                                                    </span>
                                                                </div>
                                                                <img
                                                                    src={item.content.url}
                                                                    alt=""
                                                                    className="w-full max-h-[75vh] object-contain bg-black block"
                                                                />
                                                            </div>

                                                            {/* Caption di bawah modal */}
                                                            {item.content?.caption && (
                                                                <p className="mt-4 text-center text-sm text-gray-300">
                                                                    {item.content.caption}
                                                                </p>
                                                            )}
                                                            <p className="mt-2 text-center text-xs text-gray-500 italic">
                                                                Klik di luar gambar untuk menutup
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Layout normal: gambar kiri + caption kanan (atau atas-bawah di mobile) */}
                                                <div className="mb-5 flex flex-col md:flex-row items-start gap-4">
                                                    {/* Gambar */}
                                                    <div className="w-full md:w-[55%] flex-shrink-0">
                                                        <div className="flex items-center gap-2 rounded-t-xl px-3 py-2 bg-blue-500/10 border border-blue-500/20 border-b-0">
                                                            <span className="h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_8px_#60a5fa]" />
                                                            <span className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase">
                                                                Image
                                                            </span>
                                                        </div>
                                                        <div
                                                            className="group relative overflow-hidden rounded-b-xl border border-blue-500/20 cursor-pointer bg-black"
                                                            onClick={() => setIsOpen(true)}
                                                        >
                                                            <img
                                                                src={item.content.url}
                                                                alt={item.content.caption || 'Module image'}
                                                                className="w-full h-auto block transition-all duration-300 group-hover:brightness-75 object-cover"
                                                            />
                                                            {/* Hover overlay */}
                                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                                                <div className="flex items-center gap-2 rounded-lg px-3 py-1.5 bg-blue-500/30 border border-blue-500/50 backdrop-blur-sm">
                                                                    <ZoomIn className="h-4 w-4 text-white" />
                                                                    <span className="text-xs font-semibold text-white">
                                                                        Perbesar
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Caption */}
                                                    {item.content?.caption && (
                                                        <div className="flex flex-1 flex-col gap-3 rounded-xl p-4 bg-blue-500/5 border border-blue-500/15 w-full">
                                                            <div className="flex items-center gap-2">
                                                                <span className="rounded px-2 py-0.5 text-[9px] font-bold tracking-widest uppercase bg-blue-500/15 text-blue-400 border border-blue-500/30">
                                                                    Catatan
                                                                </span>
                                                            </div>
                                                            <p className="text-[13px] leading-relaxed text-gray-300 whitespace-pre-wrap">
                                                                {item.content.caption}
                                                            </p>
                                                            <div className="mt-auto flex items-center gap-2 pt-3 border-t border-dashed border-blue-500/20">
                                                                <span className="text-[10px] text-gray-500 italic">
                                                                    💡 Klik gambar untuk memperbesar
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </>
                                        );
                                    })()}

                                {/* ── VIDEO ── */}
                                {item.type === 'video' && (
                                    <div className="mb-5 overflow-hidden rounded-xl border border-blue-500/20 shadow-lg shadow-black/50">
                                        <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 border-b border-blue-500/20">
                                            <span className="h-2 w-2 rounded-full bg-green-400 shadow-[0_0_8px_#4ade80]" />
                                            <span className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase">
                                                Video
                                            </span>
                                        </div>
                                        <div className="aspect-video w-full">
                                            <video
                                                controls
                                                className="w-full h-full block bg-black"
                                            >
                                                <source src={item.content.url} />
                                            </video>
                                        </div>
                                    </div>
                                )}

                                {/* ── FILE ── */}
                                {item.type === 'file' && (
                                    <div className="mb-4 flex items-center gap-3 rounded-xl border border-gray-700 bg-[#0f1226] px-4 py-3">
                                        {/* icon */}
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10">
                                            <FileText className="h-5 w-5 text-indigo-400" />
                                        </div>

                                        {/* content */}
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-semibold text-white">
                                                Materi File
                                            </p>

                                            <p className="truncate text-xs text-gray-400">
                                                {item.content.url
                                                    .split('/')
                                                    .pop()}
                                            </p>
                                        </div>

                                        {/* action */}
                                        <a
                                            href={item.content.url}
                                            target="_blank"
                                            className="rounded-md bg-indigo-500/20 px-3 py-1.5 text-xs text-indigo-300"
                                        >
                                            Download
                                        </a>
                                    </div>
                                )}

                                {/* Divider antar konten */}
                                {index < (module.contents?.length ?? 0) - 1 && (
                                    <div className="mb-5 border-b border-dashed border-blue-500/20" />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* ================= FOOTER (DIAM) ================= */}
                    <div className="flex flex-shrink-0 flex-col sm:flex-row gap-3 items-center justify-between pt-2">
                        <div className="flex w-full sm:w-auto justify-between sm:justify-start gap-2">
                            {prevModule && (
                                <button
                                    onClick={() => goToModule(prevModule)}
                                    className="rounded-lg px-4 py-2.5 sm:py-2 text-sm font-bold text-white transition-all hover:brightness-110 bg-white/5 border border-white/20 font-['Orbitron'] flex-1 sm:flex-none text-center"
                                >
                                    ← Prev
                                </button>
                            )}
                            {nextModule && (
                                <button
                                    onClick={() => {
                                        if (isUnlocked(currentIndex + 1)) {
                                            goToModule(nextModule);
                                        }
                                    }}
                                    disabled={!isUnlocked(currentIndex + 1)}
                                    className={`rounded-lg px-4 py-2.5 sm:py-2 text-sm font-bold transition-all font-['Orbitron'] flex-1 sm:flex-none text-center ${
                                        isUnlocked(currentIndex + 1)
                                            ? 'text-white hover:brightness-110 bg-blue-500/10 border border-blue-500/40'
                                            : 'text-gray-500 bg-gray-800/50 border border-gray-700 cursor-not-allowed opacity-50'
                                    }`}
                                >
                                    Next Module
                                </button>
                            )}
                        </div>

                        <div className="flex w-full sm:w-auto gap-2">
                            {!isCompleted(module._id) && (
                                <button
                                    onClick={completeModule}
                                    className="rounded-lg px-5 py-2.5 sm:py-2 text-sm font-bold transition-all hover:brightness-110 bg-green-500/15 border border-green-500/50 text-green-400 font-['Orbitron'] w-full sm:w-auto"
                                >
                                    ✓ Tandai Selesai
                                </button>
                            )}
                            {isLastModule && finalQuizId && allCompleted && (
                                <button
                                    onClick={() => router.visit(`/student/quiz/${finalQuizId}`)}
                                    className="rounded-lg px-6 py-2.5 sm:py-2 text-sm font-bold transition-all hover:brightness-110 bg-[#F0C419] text-black font-['Orbitron'] shadow-[0_0_16px_rgba(240,196,25,0.4)] w-full sm:w-auto"
                                >
                                    MULAI TEST →
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
