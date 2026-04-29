import React, { useEffect } from 'react';
import { router, Link } from '@inertiajs/react';
import { Lock, Check, Play, FileText, X, ZoomIn } from 'lucide-react';
import { show as learnShow } from '@/actions/App/Http/Controllers/Student/LearnController';

import courses from '@/routes/student/courses';

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
        router.visit(learnShow.url([course._id, path._id, mod._id]));
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
        // ROOT: h-screen + overflow-hidden = tidak ada scroll di luar
        <div className="flex h-screen flex-col overflow-hidden bg-[#040812] text-white">
            {/* ================= HEADER (DIAM) ================= */}
            <div className="w-full flex-shrink-0 px-1 pt-0.5">
                <div
                    className="relative border-[2px] md:border-[3px]"
                    style={{
                        borderImage:
                            'linear-gradient(to bottom, #3B28F6 0%, #4c2fff 30%, #7c3aed 50%, #facc15 100%) 1',
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
            {/* flex-1 mengisi sisa tinggi, overflow-hidden mencegah main ikut scroll */}
            <div className="flex min-h-0 flex-1 gap-2 overflow-hidden px-1 pt-2 pb-1">
                {/* ================= LEFT PANEL (DIAM) ================= */}
                {/* flex-shrink-0 + overflow-hidden = sidebar tidak bisa scroll keluar */}
                <div
                    className="flex w-[260px] flex-shrink-0 flex-col gap-2 overflow-hidden rounded-xl p-3 sm:w-[280px]"
                    style={{
                        background:
                            'linear-gradient(180deg, #0d1229 0%, #080d1e 100%)',
                        border: '1px solid rgba(99,130,255,0.3)',
                    }}
                >
                    {/* Label header sidebar — tidak scroll */}
                    <p
                        className="flex-shrink-0 px-1 text-xs font-bold tracking-[0.2em] text-gray-400 uppercase"
                        style={{ fontFamily: 'Orbitron, sans-serif' }}
                    >
                        Quest Modules
                    </p>

                    {/* List modul — HANYA ini yang scroll di dalam sidebar */}
                    <div
                        className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pr-1"
                        style={{
                            scrollbarWidth: 'thin',
                            scrollbarColor: 'rgba(99,130,255,0.3) transparent',
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
                                    className={`relative flex items-center gap-3 rounded-xl px-3 py-3 transition-all duration-300 ${unlocked ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                                    style={{
                                        background: isActive
                                            ? 'linear-gradient(135deg, #1a2060 0%, #0e1540 100%)'
                                            : done
                                              ? 'linear-gradient(135deg, #0a2a1a 0%, #0d1f2d 100%)'
                                              : 'rgba(255,255,255,0.03)',
                                        border: isActive
                                            ? '1px solid rgba(99,130,255,0.8)'
                                            : done
                                              ? '1px solid rgba(74,222,128,0.5)'
                                              : '1px solid rgba(255,255,255,0.06)',
                                        boxShadow: isActive
                                            ? '0 0 16px rgba(99,130,255,0.2)'
                                            : done
                                              ? '0 0 10px rgba(74,222,128,0.1)'
                                              : 'none',
                                        opacity: !unlocked ? 0.4 : 1,
                                    }}
                                >
                                    {/* Icon Box */}
                                    <div
                                        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg"
                                        style={{
                                            background: isActive
                                                ? 'rgba(99,130,255,0.2)'
                                                : done
                                                  ? 'rgba(74,222,128,0.15)'
                                                  : 'rgba(255,255,255,0.05)',
                                            border: isActive
                                                ? '1px solid rgba(99,130,255,0.6)'
                                                : done
                                                  ? '1px solid rgba(74,222,128,0.4)'
                                                  : '1px solid rgba(255,255,255,0.08)',
                                        }}
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
                                            <span
                                                className="text-xs font-bold text-gray-400"
                                                style={{
                                                    fontFamily:
                                                        'Orbitron, sans-serif',
                                                }}
                                            >
                                                {String(index + 1).padStart(
                                                    2,
                                                    '0',
                                                )}
                                            </span>
                                        )}
                                    </div>

                                    {/* Text */}
                                    <div className="flex min-w-0 flex-col">
                                        <span
                                            className="mb-0.5 text-[10px] font-semibold tracking-widest uppercase"
                                            style={{
                                                fontFamily:
                                                    'Orbitron, sans-serif',
                                                color: isActive
                                                    ? '#6382ff'
                                                    : done
                                                      ? '#4ade80'
                                                      : 'rgba(255,255,255,0.3)',
                                            }}
                                        >
                                            Modul{' '}
                                            {String(index + 1).padStart(2, '0')}
                                        </span>
                                        <span
                                            className="truncate text-sm leading-tight font-bold"
                                            style={{
                                                color: isActive
                                                    ? '#ffffff'
                                                    : done
                                                      ? '#a7f3d0'
                                                      : unlocked
                                                        ? 'rgba(255,255,255,0.6)'
                                                        : 'rgba(255,255,255,0.3)',
                                            }}
                                        >
                                            {mod.title}
                                        </span>
                                    </div>

                                    {isActive && (
                                        <div
                                            className="absolute top-2 bottom-2 left-0 w-[3px] rounded-full"
                                            style={{
                                                background:
                                                    'linear-gradient(to bottom, #99E4FD, #9681FF)',
                                            }}
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* ================= RIGHT PANEL ================= */}
                {/* flex-1 + min-h-0 + overflow-hidden = kanan mengisi sisa, tidak bocor */}
                <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden">
                    <div
                        className="min-h-0 flex-1 overflow-y-auto rounded-xl p-5"
                        style={{
                            background:
                                'linear-gradient(180deg, #0d1229 0%, #080d1e 100%)',
                            border: '1px solid rgba(99,130,255,0.3)',
                            scrollbarWidth: 'thin',
                            scrollbarColor: 'rgba(99,130,255,0.3) transparent',
                        }}
                    >
                        {/* Module Title */}
                        <div className="mb-6 flex items-center gap-3">
                            <div
                                style={{
                                    width: 3,
                                    height: 24,
                                    background:
                                        'linear-gradient(180deg, #6382ff, #a78bfa)',
                                    borderRadius: 9999,
                                }}
                            />
                            <h2
                                className="text-xl font-bold text-white"
                                style={{
                                    fontFamily: 'Orbitron, sans-serif',
                                    letterSpacing: '0.05em',
                                }}
                            >
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
                                                <span
                                                    className="rounded px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase"
                                                    style={{
                                                        background:
                                                            'rgba(99,130,255,0.15)',
                                                        color: '#6382ff',
                                                        border: '1px solid rgba(99,130,255,0.3)',
                                                    }}
                                                >
                                                    {String(index + 1).padStart(
                                                        2,
                                                        '0',
                                                    )}
                                                </span>
                                                <h3
                                                    className="text-base font-bold text-blue-300"
                                                    style={{
                                                        fontFamily:
                                                            'Orbitron, sans-serif',
                                                    }}
                                                >
                                                    {item.content.title}
                                                </h3>
                                            </div>
                                        )}
                                        <p
                                            className="text-[14px] leading-relaxed whitespace-pre-wrap text-gray-300"
                                            style={{
                                                paddingLeft: '1.75rem',
                                                borderLeft:
                                                    '2px solid rgba(99,130,255,0.15)',
                                            }}
                                        >
                                            {item.content?.description ||
                                                item.content?.text}
                                        </p>
                                    </div>
                                )}

                                {/* ── YOUTUBE ── */}
                                {item.type === 'youtube' && (
                                    <div
                                        className="mb-5 overflow-hidden rounded-xl"
                                        style={{
                                            border: '1px solid rgba(99,130,255,0.25)',
                                        }}
                                    >
                                        <div
                                            className="flex items-center gap-2 px-4 py-2"
                                            style={{
                                                background:
                                                    'rgba(99,130,255,0.08)',
                                                borderBottom:
                                                    '1px solid rgba(99,130,255,0.15)',
                                            }}
                                        >
                                            <span className="h-2 w-2 rounded-full bg-red-500" />
                                            <span className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase">
                                                Video
                                            </span>
                                        </div>
                                        <iframe
                                            src={getYoutubeEmbedUrl(
                                                item.content.url,
                                            )}
                                            className="h-[360px] w-full"
                                            allowFullScreen
                                            style={{ display: 'block' }}
                                        />
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
                                                        className="fixed inset-0 z-50 flex items-center justify-center"
                                                        style={{
                                                            background:
                                                                'rgba(0,0,0,0.85)',
                                                            backdropFilter:
                                                                'blur(6px)',
                                                        }}
                                                        onClick={() =>
                                                            setIsOpen(false)
                                                        }
                                                    >
                                                        <div
                                                            className="relative mx-6 w-full max-w-4xl"
                                                            onClick={(e) =>
                                                                e.stopPropagation()
                                                            }
                                                        >
                                                            {/* Close button */}
                                                            <button
                                                                onClick={() =>
                                                                    setIsOpen(
                                                                        false,
                                                                    )
                                                                }
                                                                className="absolute -top-10 right-0 flex items-center gap-1.5 text-gray-400 transition-colors hover:text-white"
                                                            >
                                                                <X className="h-4 w-4" />
                                                                <span className="text-xs tracking-wider uppercase">
                                                                    Tutup
                                                                </span>
                                                            </button>

                                                            {/* Image */}
                                                            <div
                                                                className="overflow-hidden rounded-xl"
                                                                style={{
                                                                    border: '1px solid rgba(99,130,255,0.35)',
                                                                    boxShadow:
                                                                        '0 0 60px rgba(99,130,255,0.15)',
                                                                }}
                                                            >
                                                                <div
                                                                    className="flex items-center gap-2 px-4 py-2"
                                                                    style={{
                                                                        background:
                                                                            'rgba(99,130,255,0.1)',
                                                                        borderBottom:
                                                                            '1px solid rgba(99,130,255,0.2)',
                                                                    }}
                                                                >
                                                                    <span
                                                                        className="h-2 w-2 rounded-full"
                                                                        style={{
                                                                            background:
                                                                                '#6382ff',
                                                                        }}
                                                                    />
                                                                    <span className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase">
                                                                        Image
                                                                        Preview
                                                                    </span>
                                                                </div>
                                                                <img
                                                                    src={
                                                                        item
                                                                            .content
                                                                            .url
                                                                    }
                                                                    alt=""
                                                                    style={{
                                                                        width: '100%',
                                                                        display:
                                                                            'block',
                                                                        maxHeight:
                                                                            '75vh',
                                                                        objectFit:
                                                                            'contain',
                                                                        background:
                                                                            '#000',
                                                                    }}
                                                                />
                                                            </div>

                                                            {/* Caption di bawah modal */}
                                                            <p className="mt-3 text-center text-xs text-gray-500 italic">
                                                                Klik di luar
                                                                gambar untuk
                                                                menutup
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Layout normal: gambar kiri + caption kanan */}
                                                <div className="mb-5 flex items-start gap-4">
                                                    {/* Gambar - kiri */}
                                                    <div
                                                        className="flex-shrink-0"
                                                        style={{ width: '55%' }}
                                                    >
                                                        <div
                                                            className="flex items-center gap-2 rounded-t-xl px-3 py-1.5"
                                                            style={{
                                                                background:
                                                                    'rgba(99,130,255,0.08)',
                                                                border: '1px solid rgba(99,130,255,0.25)',
                                                                borderBottom:
                                                                    'none',
                                                            }}
                                                        >
                                                            <span
                                                                className="h-2 w-2 rounded-full"
                                                                style={{
                                                                    background:
                                                                        '#6382ff',
                                                                }}
                                                            />
                                                            <span className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase">
                                                                Image
                                                            </span>
                                                        </div>
                                                        <div
                                                            className="group relative overflow-hidden rounded-b-xl"
                                                            style={{
                                                                border: '1px solid rgba(99,130,255,0.25)',
                                                                cursor: 'pointer',
                                                            }}
                                                            onClick={() =>
                                                                setIsOpen(true)
                                                            }
                                                        >
                                                            <img
                                                                src={
                                                                    item.content
                                                                        .url
                                                                }
                                                                alt=""
                                                                style={{
                                                                    width: '100%',
                                                                    display:
                                                                        'block',
                                                                    transition:
                                                                        'filter 0.2s ease',
                                                                }}
                                                                className="group-hover:brightness-75"
                                                            />
                                                            {/* Hover overlay */}
                                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                                                                <div
                                                                    className="flex items-center gap-2 rounded-lg px-3 py-1.5"
                                                                    style={{
                                                                        background:
                                                                            'rgba(99,130,255,0.25)',
                                                                        border: '1px solid rgba(99,130,255,0.5)',
                                                                        backdropFilter:
                                                                            'blur(4px)',
                                                                    }}
                                                                >
                                                                    <ZoomIn className="h-4 w-4 text-white" />
                                                                    <span className="text-xs font-semibold text-white">
                                                                        Perbesar
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Caption - kanan */}
                                                    <div
                                                        className="flex flex-1 flex-col gap-3 rounded-xl p-4"
                                                        style={{
                                                            background:
                                                                'rgba(99,130,255,0.05)',
                                                            border: '1px solid rgba(99,130,255,0.15)',
                                                        }}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <span
                                                                className="rounded px-2 py-0.5 text-[9px] font-bold tracking-widest uppercase"
                                                                style={{
                                                                    background:
                                                                        'rgba(99,130,255,0.15)',
                                                                    color: '#6382ff',
                                                                    border: '1px solid rgba(99,130,255,0.3)',
                                                                }}
                                                            >
                                                                Catatan
                                                            </span>
                                                        </div>
                                                        <p className="text-[13px] leading-relaxed text-gray-300">
                                                            {/* Ganti dengan item.content.caption nanti */}
                                                            Gambar ini
                                                            menjelaskan struktur
                                                            dasar dari materi
                                                            yang sedang
                                                            dipelajari.
                                                            Perhatikan setiap
                                                            bagian dengan
                                                            seksama untuk
                                                            memahami konsepnya
                                                            secara menyeluruh
                                                            dan hubungannya
                                                            dengan materi
                                                            lainnya. pada gambar
                                                            ini terdapat
                                                            beberapa bagian
                                                            penting yang akan
                                                            membantu kamu
                                                            memahami topik ini
                                                            dengan lebih baik.
                                                            lalu jika kamu ingin
                                                            melihat detailnya,
                                                            klik saja gambarnya
                                                            untuk
                                                            memperbesar.dan html
                                                            ini adalah contoh
                                                            caption yang cukup
                                                            panjang untuk
                                                            menguji bagaimana
                                                            tampilan teks dalam
                                                            kotak caption ketika
                                                            melebihi batas
                                                            tertentu. Dengan
                                                            adanya caption ini,
                                                            diharapkan kamu bisa
                                                            mendapatkan insight
                                                            tambahan tentang
                                                            gambar yang sedang
                                                            kamu lihat, sehingga
                                                            proses belajar
                                                            menjadi lebih
                                                            efektif dan
                                                            menyenangkan.
                                                        </p>
                                                        <div
                                                            className="mt-auto flex items-center gap-2 pt-3"
                                                            style={{
                                                                borderTop:
                                                                    '1px dashed rgba(99,130,255,0.15)',
                                                            }}
                                                        >
                                                            <span className="text-[10px] text-gray-600 italic">
                                                                💡 Klik gambar
                                                                untuk
                                                                memperbesar
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        );
                                    })()}

                                {/* ── VIDEO ── */}
                                {item.type === 'video' && (
                                    <div
                                        className="mb-5 overflow-hidden rounded-xl"
                                        style={{
                                            border: '1px solid rgba(99,130,255,0.25)',
                                        }}
                                    >
                                        <div
                                            className="flex items-center gap-2 px-4 py-2"
                                            style={{
                                                background:
                                                    'rgba(99,130,255,0.08)',
                                                borderBottom:
                                                    '1px solid rgba(99,130,255,0.15)',
                                            }}
                                        >
                                            <span className="h-2 w-2 rounded-full bg-green-400" />
                                            <span className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase">
                                                Video
                                            </span>
                                        </div>
                                        <video
                                            controls
                                            className="w-full"
                                            style={{
                                                display: 'block',
                                                background: '#000',
                                            }}
                                        >
                                            <source src={item.content.url} />
                                        </video>
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
                                    <div
                                        className="mb-5"
                                        style={{
                                            borderBottom:
                                                '1px dashed rgba(99,130,255,0.1)',
                                        }}
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* ================= FOOTER (DIAM) ================= */}
                    <div className="flex flex-shrink-0 items-center justify-between">
                        <div className="flex gap-2">
                            {prevModule && (
                                <button
                                    onClick={() => goToModule(prevModule)}
                                    className="rounded-lg px-4 py-2 text-sm font-bold text-white transition-all hover:brightness-110"
                                    style={{
                                        background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid rgba(255,255,255,0.15)',
                                        fontFamily: 'Orbitron, sans-serif',
                                    }}
                                >
                                    ← Prev
                                </button>
                            )}
                            {nextModule && (
                                <button
                                    onClick={() => goToModule(nextModule)}
                                    className="rounded-lg px-4 py-2 text-sm font-bold text-white transition-all hover:brightness-110"
                                    style={{
                                        background: 'rgba(99,130,255,0.1)',
                                        border: '1px solid rgba(99,130,255,0.4)',
                                        fontFamily: 'Orbitron, sans-serif',
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
                                    className="rounded-lg px-5 py-2 text-sm font-bold transition-all hover:brightness-110"
                                    style={{
                                        background: 'rgba(74,222,128,0.15)',
                                        border: '1px solid rgba(74,222,128,0.5)',
                                        color: '#4ade80',
                                        fontFamily: 'Orbitron, sans-serif',
                                    }}
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
                                    className="rounded-lg px-6 py-2 text-sm font-bold transition-all hover:brightness-110"
                                    style={{
                                        background: '#F0C419',
                                        color: '#020202',
                                        fontFamily: 'Orbitron, sans-serif',
                                        boxShadow:
                                            '0 0 16px rgba(240,196,25,0.4)',
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
    );
}
