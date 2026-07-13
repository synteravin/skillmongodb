import React, { useEffect, useState } from 'react';
import { router, Link } from '@inertiajs/react';
import {
    Lock,
    Check,
    Play,
    FileText,
    X,
    ZoomIn,
    ChevronDown,
    BookOpen,
} from 'lucide-react';

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

/* ================= IMAGE CONTENT ================= */
function ImageContent({ item }: { item: Content }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Lightbox Modal */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md dark:bg-black/90"
                    onClick={() => setIsOpen(false)}
                >
                    <div
                        className="relative mx-4 w-full max-w-4xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close button */}
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute -top-10 right-0 flex items-center gap-1.5 text-white/70 transition-colors hover:text-white dark:text-gray-400 dark:hover:text-white"
                        >
                            <X className="h-4 w-4" />
                            <span className="font-['Orbitron'] text-xs tracking-wider uppercase">
                                Tutup
                            </span>
                        </button>

                        {/* Image */}
                        <div className="overflow-hidden rounded-xl border border-blue-300 shadow-[0_0_60px_rgba(59,130,246,0.25)] dark:border-blue-500/40 dark:shadow-[0_0_60px_rgba(59,130,246,0.2)]">
                            <div className="flex items-center gap-2 border-b border-blue-200 bg-blue-50 px-4 py-2 dark:border-blue-500/30 dark:bg-blue-500/10">
                                <span className="h-2 w-2 rounded-full bg-blue-500 dark:bg-blue-400 dark:shadow-[0_0_8px_#60a5fa]" />
                                <span className="text-[10px] font-semibold tracking-widest text-blue-500 uppercase dark:text-gray-400">
                                    Image Preview
                                </span>
                            </div>
                            <img
                                src={item.content.url}
                                alt=""
                                className="block max-h-[75vh] w-full bg-white object-contain dark:bg-black"
                            />
                        </div>

                        {/* Caption di bawah modal */}
                        {item.content?.caption && (
                            <p className="mt-4 text-center text-sm text-white/80 dark:text-gray-300">
                                {item.content.caption}
                            </p>
                        )}
                        <p className="mt-2 text-center text-xs text-white/50 italic dark:text-gray-500">
                            Klik di luar gambar untuk menutup
                        </p>
                    </div>
                </div>
            )}

            {/* Layout normal: gambar kiri + caption kanan (atau atas-bawah di mobile) */}
            <div className="mb-5 flex flex-col items-start gap-4 md:flex-row">
                {/* Gambar */}
                <div className="w-full flex-shrink-0 md:w-[55%]">
                    <div className="flex items-center gap-2 rounded-t-xl border border-b-0 border-blue-200 bg-blue-50 px-3 py-2 dark:border-blue-500/20 dark:bg-blue-500/10">
                        <span className="h-2 w-2 rounded-full bg-blue-500 dark:bg-blue-400 dark:shadow-[0_0_8px_#60a5fa]" />
                        <span className="text-[10px] font-semibold tracking-widest text-blue-500 uppercase dark:text-gray-400">
                            Image
                        </span>
                    </div>
                    <div
                        className="group relative cursor-pointer overflow-hidden rounded-b-xl border border-blue-200 bg-[#f8faff] dark:border-blue-500/20 dark:bg-black"
                        onClick={() => setIsOpen(true)}
                    >
                        <img
                            src={item.content.url}
                            alt={item.content.caption || 'Module image'}
                            className="block h-auto w-full object-cover transition-all duration-300 group-hover:brightness-90 dark:group-hover:brightness-75"
                        />
                        {/* Hover overlay */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                            <div className="flex items-center gap-2 rounded-lg border border-blue-300 bg-white/80 px-3 py-1.5 shadow backdrop-blur-sm dark:border-blue-500/50 dark:bg-blue-500/30 dark:shadow-none">
                                <ZoomIn className="h-4 w-4 text-blue-600 dark:text-white" />
                                <span className="text-xs font-semibold text-blue-700 dark:text-white">
                                    Perbesar
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Caption */}
                {item.content?.caption && (
                    <div className="flex w-full flex-1 flex-col gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-500/15 dark:bg-blue-500/5">
                        <div className="flex items-center gap-2">
                            <span className="rounded border border-blue-300 bg-blue-100 px-2 py-0.5 text-[9px] font-bold tracking-widest text-blue-600 uppercase dark:border-blue-500/30 dark:bg-blue-500/15 dark:text-blue-400">
                                Catatan
                            </span>
                        </div>
                        <p className="text-[13px] leading-relaxed whitespace-pre-wrap text-[#334155] dark:text-gray-300">
                            {item.content.caption}
                        </p>
                        <div className="mt-auto flex items-center gap-2 border-t border-dashed border-blue-200 pt-3 dark:border-blue-500/20">
                            <span className="text-[10px] text-gray-400 italic dark:text-gray-500">
                                💡 Klik gambar untuk memperbesar
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

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
            <div className="p-10 text-[#1e3a8a] dark:text-white">
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

    const [moduleDropdownOpen, setModuleDropdownOpen] = useState(false);

    return (
        <div className="flex h-screen flex-col overflow-hidden bg-[#f0f4ff] text-[#1e293b] dark:bg-[#040812] dark:text-white">
            {/* ================= HEADER ================= */}
            <div className="w-full flex-shrink-0 px-1 pt-0.5">
                <div
                    className="relative border-[2px] border-transparent md:border-[3px]"
                    style={{
                        borderImage:
                            'linear-gradient(to right, #2563EB 0%, #3b82f6 30%, #6366f1 50%, #facc15 100%) 1',
                    }}
                >
                    <div className="flex items-center gap-4 bg-white px-4 py-4 shadow-sm md:px-6 dark:bg-[#040812] dark:shadow-none">
                        <Link
                            href={`/student/courses/${course.slug}`}
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded border-2 border-blue-300 bg-[#eff6ff] p-2 transition-colors hover:border-blue-500 hover:bg-blue-100 md:h-12 md:w-12 dark:border-blue-800 dark:bg-[#0b1021] dark:hover:border-blue-600 dark:hover:bg-blue-900/40"
                        >
                            <svg
                                viewBox="0 0 48 48"
                                className="h-7 w-7 scale-125 text-blue-600 transition-transform duration-200 hover:scale-150 md:h-9 md:w-9 dark:text-indigo-500"
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
                        <h1 className="font-['Orbitron'] text-xl font-bold tracking-[0.15em] text-[#1e3a8a] uppercase md:text-2xl lg:text-3xl dark:text-white">
                            {course.title}
                        </h1>
                    </div>
                </div>
            </div>

            {/* ================= MAIN ================= */}
            <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden px-1 pt-2 pb-1 md:flex-row">
                {/* ================= LEFT PANEL ================= */}

                {/* MOBILE: Dropdown */}
                <div className="flex-shrink-0 md:hidden">
                    <button
                        onClick={() => setModuleDropdownOpen((prev) => !prev)}
                        className="flex w-full items-center justify-between rounded-xl border border-blue-200 bg-white px-4 py-3 shadow-sm dark:border-blue-500/30 dark:bg-gradient-to-r dark:from-[#0d1229] dark:to-[#080d1e]"
                    >
                        <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                            <span className="font-['Orbitron'] text-xs font-bold tracking-[0.2em] text-blue-500 uppercase dark:text-gray-400">
                                Quest Modules
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-blue-400 dark:text-gray-500">
                                {
                                    modules.filter((m) => isCompleted(m._id))
                                        .length
                                }
                                /{modules.length}
                            </span>
                            <ChevronDown
                                className={`h-4 w-4 text-blue-400 transition-transform duration-300 dark:text-gray-400 ${
                                    moduleDropdownOpen ? 'rotate-180' : ''
                                }`}
                            />
                        </div>
                    </button>

                    <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                            moduleDropdownOpen
                                ? 'max-h-[60vh] opacity-100'
                                : 'max-h-0 opacity-0'
                        }`}
                    >
                        <div className="scrollbar-thin scrollbar-track-transparent scrollbar-thumb-blue-200 mt-1 flex max-h-[60vh] flex-col gap-2 overflow-y-auto rounded-xl border border-blue-200 bg-white p-3 shadow-sm dark:border-blue-500/30 dark:bg-gradient-to-b dark:from-[#0d1229] dark:to-[#080d1e]">
                            {modules.map((mod, index) => {
                                const isActive = module._id === mod._id;
                                const unlocked = isUnlocked(index);
                                const done = isCompleted(mod._id);

                                return (
                                    <div
                                        key={`mod_mobile_${index}`}
                                        onClick={() => {
                                            if (unlocked) {
                                                goToModule(mod);
                                                setModuleDropdownOpen(false);
                                            }
                                        }}
                                        className={`relative flex items-center gap-3 rounded-xl px-3 py-3 transition-all duration-300 ${
                                            unlocked
                                                ? 'cursor-pointer'
                                                : 'cursor-not-allowed opacity-40'
                                        } ${
                                            isActive
                                                ? 'border border-blue-400 bg-gradient-to-br from-[#dbeafe] to-[#eff6ff] shadow-[0_0_12px_rgba(59,130,246,0.15)] dark:border-blue-500/80 dark:from-[#1a2060] dark:to-[#0e1540] dark:shadow-[0_0_16px_rgba(99,130,255,0.2)]'
                                                : done
                                                  ? 'border border-green-400/60 bg-gradient-to-br from-[#dcfce7] to-[#f0fdf4] dark:border-green-500/50 dark:from-[#0a2a1a] dark:to-[#0d1f2d]'
                                                  : 'border border-blue-100 bg-[#f8faff] hover:border-blue-300 hover:bg-blue-50 dark:border-white/5 dark:bg-white/5'
                                        }`}
                                    >
                                        <div
                                            className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border ${
                                                isActive
                                                    ? 'border-blue-400 bg-blue-100 dark:border-blue-500/60 dark:bg-blue-500/20'
                                                    : done
                                                      ? 'border-green-400/60 bg-green-100 dark:border-green-500/40 dark:bg-green-500/15'
                                                      : 'border-blue-200 bg-blue-50 dark:border-white/10 dark:bg-white/5'
                                            }`}
                                        >
                                            {!unlocked ? (
                                                <Lock className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                                            ) : done ? (
                                                <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                                            ) : isActive ? (
                                                <Play
                                                    className="h-4 w-4 text-blue-600 dark:text-indigo-300"
                                                    fill="currentColor"
                                                />
                                            ) : (
                                                <span className="font-['Orbitron'] text-xs font-bold text-blue-400 dark:text-gray-400">
                                                    {String(index + 1).padStart(
                                                        2,
                                                        '0',
                                                    )}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex min-w-0 flex-col">
                                            <span
                                                className={`mb-0.5 font-['Orbitron'] text-[10px] font-semibold tracking-widest uppercase ${
                                                    isActive
                                                        ? 'text-blue-500 dark:text-blue-400'
                                                        : done
                                                          ? 'text-green-600 dark:text-green-400'
                                                          : 'text-blue-300 dark:text-white/30'
                                                }`}
                                            >
                                                Modul{' '}
                                                {String(index + 1).padStart(
                                                    2,
                                                    '0',
                                                )}
                                            </span>
                                            <span
                                                className={`truncate text-sm leading-tight font-bold ${
                                                    isActive
                                                        ? 'text-[#1e3a8a] dark:text-white'
                                                        : done
                                                          ? 'text-green-800 dark:text-green-200'
                                                          : unlocked
                                                            ? 'text-[#334155] dark:text-white/60'
                                                            : 'text-gray-400 dark:text-white/30'
                                                }`}
                                            >
                                                {mod.title}
                                            </span>
                                        </div>
                                        {isActive && (
                                            <div className="absolute top-2 bottom-2 left-0 w-[3px] rounded-full bg-gradient-to-b from-[#2563EB] to-[#6366f1] dark:from-[#99E4FD] dark:to-[#9681FF]" />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* DESKTOP: Panel biasa */}
                <div className="hidden w-full flex-col gap-2 overflow-hidden rounded-xl border border-blue-200 bg-white p-3 shadow-sm md:flex md:w-[260px] md:flex-shrink-0 lg:w-[280px] dark:border-blue-500/30 dark:bg-gradient-to-b dark:from-[#0d1229] dark:to-[#080d1e] dark:shadow-none">
                    <p className="flex-shrink-0 px-1 font-['Orbitron'] text-xs font-bold tracking-[0.2em] text-blue-500 uppercase dark:text-gray-400">
                        Quest Modules
                    </p>
                    <div className="scrollbar-thin scrollbar-track-transparent scrollbar-thumb-blue-200 dark:scrollbar-thumb-blue-500/30 flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pr-1">
                        {modules.map((mod, index) => {
                            const isActive = module._id === mod._id;
                            const unlocked = isUnlocked(index);
                            const done = isCompleted(mod._id);

                            return (
                                <div
                                    key={`mod_${index}`}
                                    onClick={() => unlocked && goToModule(mod)}
                                    className={`relative flex items-center gap-3 rounded-xl px-3 py-3 transition-all duration-300 ${
                                        unlocked
                                            ? 'cursor-pointer'
                                            : 'cursor-not-allowed opacity-40'
                                    } ${
                                        isActive
                                            ? 'border border-blue-400 bg-gradient-to-br from-[#dbeafe] to-[#eff6ff] shadow-[0_0_12px_rgba(59,130,246,0.15)] dark:border-blue-500/80 dark:from-[#1a2060] dark:to-[#0e1540] dark:shadow-[0_0_16px_rgba(99,130,255,0.2)]'
                                            : done
                                              ? 'border border-green-400/60 bg-gradient-to-br from-[#dcfce7] to-[#f0fdf4] dark:border-green-500/50 dark:from-[#0a2a1a] dark:to-[#0d1f2d] dark:shadow-[0_0_10px_rgba(74,222,128,0.1)]'
                                              : 'border border-blue-100 bg-[#f8faff] hover:border-blue-300 hover:bg-blue-50 dark:border-white/5 dark:bg-white/5 dark:hover:border-white/5 dark:hover:bg-white/5'
                                    }`}
                                >
                                    <div
                                        className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border ${
                                            isActive
                                                ? 'border-blue-400 bg-blue-100 dark:border-blue-500/60 dark:bg-blue-500/20'
                                                : done
                                                  ? 'border-green-400/60 bg-green-100 dark:border-green-500/40 dark:bg-green-500/15'
                                                  : 'border-blue-200 bg-blue-50 dark:border-white/10 dark:bg-white/5'
                                        }`}
                                    >
                                        {!unlocked ? (
                                            <Lock className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                                        ) : done ? (
                                            <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                                        ) : isActive ? (
                                            <Play
                                                className="h-4 w-4 text-blue-600 dark:text-indigo-300"
                                                fill="currentColor"
                                            />
                                        ) : (
                                            <span className="font-['Orbitron'] text-xs font-bold text-blue-400 dark:text-gray-400">
                                                {String(index + 1).padStart(
                                                    2,
                                                    '0',
                                                )}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex min-w-0 flex-col">
                                        <span
                                            className={`mb-0.5 font-['Orbitron'] text-[10px] font-semibold tracking-widest uppercase ${
                                                isActive
                                                    ? 'text-blue-500 dark:text-blue-400'
                                                    : done
                                                      ? 'text-green-600 dark:text-green-400'
                                                      : 'text-blue-300 dark:text-white/30'
                                            }`}
                                        >
                                            Modul{' '}
                                            {String(index + 1).padStart(2, '0')}
                                        </span>
                                        <span
                                            className={`truncate text-sm leading-tight font-bold ${
                                                isActive
                                                    ? 'text-[#1e3a8a] dark:text-white'
                                                    : done
                                                      ? 'text-green-800 dark:text-green-200'
                                                      : unlocked
                                                        ? 'text-[#334155] dark:text-white/60'
                                                        : 'text-gray-400 dark:text-white/30'
                                            }`}
                                        >
                                            {mod.title}
                                        </span>
                                    </div>
                                    {isActive && (
                                        <div className="absolute top-2 bottom-2 left-0 w-[3px] rounded-full bg-gradient-to-b from-[#2563EB] to-[#6366f1] dark:from-[#99E4FD] dark:to-[#9681FF]" />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* ================= RIGHT PANEL ================= */}
                <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden">
                    <div className="scrollbar-thin scrollbar-track-transparent scrollbar-thumb-blue-200 dark:scrollbar-thumb-blue-500/30 min-h-0 flex-1 overflow-y-auto rounded-xl border border-blue-200 bg-white p-4 shadow-sm md:p-6 lg:p-8 dark:border-blue-500/30 dark:bg-gradient-to-b dark:from-[#0d1229] dark:to-[#080d1e] dark:shadow-none">
                        {/* Module Title */}
                        <div className="mb-6 flex items-center gap-3">
                            <div className="h-6 w-[3px] rounded-full bg-gradient-to-b from-blue-500 to-indigo-400 dark:from-blue-400 dark:to-purple-400" />
                            <h2 className="font-['Orbitron'] text-lg font-bold tracking-widest text-[#1e3a8a] md:text-xl dark:text-white">
                                {module.title}
                            </h2>
                        </div>

                        {module.contents.length === 0 && (
                            <p className="text-sm text-gray-400 italic dark:text-gray-500">
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
                                                <span className="rounded border border-blue-300 bg-blue-100 px-2 py-0.5 text-[10px] font-bold tracking-widest text-blue-600 uppercase dark:border-blue-500/30 dark:bg-blue-500/15 dark:text-blue-400">
                                                    {String(index + 1).padStart(
                                                        2,
                                                        '0',
                                                    )}
                                                </span>
                                                <h3 className="font-['Orbitron'] text-base font-bold text-blue-700 dark:text-blue-300">
                                                    {item.content.title}
                                                </h3>
                                            </div>
                                        )}
                                        <p className="border-l-2 border-blue-300 pl-6 text-[14px] leading-relaxed whitespace-pre-wrap text-[#334155] md:text-[15px] dark:border-blue-500/20 dark:text-gray-300">
                                            {item.content?.description ||
                                                item.content?.text}
                                        </p>
                                    </div>
                                )}

                                {/* ── YOUTUBE ── */}
                                {item.type === 'youtube' && (
                                    <div className="mb-5 overflow-hidden rounded-xl border border-blue-200 shadow-md dark:border-blue-500/20 dark:shadow-lg dark:shadow-black/50">
                                        <div className="flex items-center gap-2 border-b border-blue-200 bg-blue-50 px-4 py-2 dark:border-blue-500/20 dark:bg-blue-500/10">
                                            <span className="h-2 w-2 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]" />
                                            <span className="text-[10px] font-semibold tracking-widest text-blue-500 uppercase dark:text-gray-400">
                                                Video
                                            </span>
                                        </div>
                                        <div className="aspect-video w-full">
                                            <iframe
                                                src={getYoutubeEmbedUrl(
                                                    item.content.url,
                                                )}
                                                className="block h-full w-full"
                                                allowFullScreen
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* ── IMAGE ── */}
                                {item.type === 'image' && (
                                    <ImageContent item={item} />
                                )}

                                {/* ── VIDEO ── */}
                                {item.type === 'video' && (
                                    <div className="mb-5 overflow-hidden rounded-xl border border-blue-200 shadow-md dark:border-blue-500/20 dark:shadow-lg dark:shadow-black/50">
                                        <div className="flex items-center gap-2 border-b border-blue-200 bg-blue-50 px-4 py-2 dark:border-blue-500/20 dark:bg-blue-500/10">
                                            <span className="h-2 w-2 rounded-full bg-green-500 dark:bg-green-400 dark:shadow-[0_0_8px_#4ade80]" />
                                            <span className="text-[10px] font-semibold tracking-widest text-blue-500 uppercase dark:text-gray-400">
                                                Video
                                            </span>
                                        </div>
                                        <div className="aspect-video w-full">
                                            <video
                                                controls
                                                className="block h-full w-full bg-[#f8faff] dark:bg-black"
                                            >
                                                <source
                                                    src={item.content.url}
                                                />
                                            </video>
                                        </div>
                                    </div>
                                )}

                                {/* ── FILE ── */}
                                {item.type === 'file' && (
                                    <div className="mb-4 flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 dark:border-gray-700 dark:bg-[#0f1226]">
                                        {/* icon */}
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-blue-300 bg-blue-100 dark:border-transparent dark:bg-indigo-500/10">
                                            <FileText className="h-5 w-5 text-blue-600 dark:text-indigo-400" />
                                        </div>

                                        {/* content */}
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-semibold text-[#1e3a8a] dark:text-white">
                                                Materi File
                                            </p>

                                            <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                                                {item.content.url
                                                    .split('/')
                                                    .pop()}
                                            </p>
                                        </div>

                                        {/* action */}
                                        <a
                                            href={item.content.url}
                                            target="_blank"
                                            className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-blue-700 dark:bg-indigo-500/20 dark:font-normal dark:text-indigo-300 dark:hover:bg-indigo-500/20"
                                        >
                                            Download
                                        </a>
                                    </div>
                                )}

                                {/* Divider antar konten */}
                                {index < (module.contents?.length ?? 0) - 1 && (
                                    <div className="mb-5 border-b border-dashed border-blue-200 dark:border-blue-500/20" />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* ================= FOOTER ================= */}
                    <div className="flex flex-shrink-0 flex-col items-center justify-between gap-3 pt-2 sm:flex-row">
                        <div className="flex w-full justify-between gap-2 sm:w-auto sm:justify-start">
                            {prevModule && (
                                <button
                                    onClick={() => goToModule(prevModule)}
                                    className="flex-1 rounded-lg border border-blue-300 bg-white px-4 py-2.5 text-center font-['Orbitron'] text-sm font-bold text-[#1e3a8a] transition-all hover:bg-blue-100 sm:flex-none sm:py-2 dark:border-white/20 dark:bg-white/5 dark:text-white dark:hover:bg-white/5 dark:hover:brightness-110"
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
                                    className={`flex-1 rounded-lg px-4 py-2.5 text-center font-['Orbitron'] text-sm font-bold transition-all sm:flex-none sm:py-2 ${
                                        isUnlocked(currentIndex + 1)
                                            ? 'border border-blue-600 bg-[#2563EB] text-white shadow-sm hover:bg-[#1d4ed8] dark:border-blue-500/40 dark:bg-blue-500/10 dark:shadow-none dark:hover:bg-blue-500/10 dark:hover:brightness-110'
                                            : 'cursor-not-allowed border border-gray-200 bg-gray-100 text-gray-400 opacity-50 dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-500'
                                    }`}
                                >
                                    Next Module
                                </button>
                            )}
                        </div>

                        <div className="flex w-full gap-2 sm:w-auto">
                            {!isCompleted(module._id) && (
                                <button
                                    onClick={completeModule}
                                    className="w-full rounded-lg border border-green-400 bg-green-50 px-5 py-2.5 font-['Orbitron'] text-sm font-bold text-green-700 shadow-sm transition-all hover:brightness-105 sm:w-auto sm:py-2 dark:border-green-500/50 dark:bg-green-500/15 dark:text-green-400 dark:shadow-none dark:hover:brightness-110"
                                >
                                    ✓ Tandai Selesai
                                </button>
                            )}
                            {isLastModule && finalQuizId && allCompleted && (
                                <button
                                    onClick={() =>
                                        router.visit(
                                            `/student/quiz/${finalQuizId}`,
                                        )
                                    }
                                    className="w-full rounded-lg border border-yellow-400 bg-[#FACC15] px-6 py-2.5 font-['Orbitron'] text-sm font-bold text-[#1e3a8a] shadow-[0_0_16px_rgba(250,204,21,0.4)] transition-all hover:brightness-105 sm:w-auto sm:py-2 dark:border-transparent dark:bg-[#F0C419] dark:text-black dark:shadow-[0_0_16px_rgba(240,196,25,0.4)] dark:hover:brightness-110"
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
