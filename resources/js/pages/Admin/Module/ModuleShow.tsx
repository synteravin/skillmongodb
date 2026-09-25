import AppLayout from '@/layouts/app-layout';
import { ArrowLeft, FileText } from 'lucide-react';

export default function ModuleShow({ module }: any) {
    return (
        <AppLayout>
            <div
                className="relative min-h-screen overflow-hidden bg-transparent px-4 py-8 text-slate-800 transition-colors duration-200 sm:px-6 lg:px-10 dark:bg-transparent dark:text-white"
                style={{ fontFamily: "'Outfit', sans-serif" }}
            >
                {/* Subtle top-center ambient glow (visible on dark mode) */}
                <div className="pointer-events-none absolute top-0 left-1/2 z-0 h-[450px] w-full max-w-7xl -translate-x-1/2 rounded-full bg-indigo-500/5 blur-[120px] select-none dark:bg-indigo-500/5" />

                <div className="relative z-10 mx-auto flex w-full flex-col gap-6">
                    {/* HEADER */}
                    <header className="relative overflow-hidden rounded-xl border border-slate-200 bg-[#f5f6ff] px-6 py-5 dark:border-white/5 dark:bg-[#0d0f17]">
                        {/* Ambient Glow Motif */}
                        <div
                            className="pointer-events-none absolute inset-0 z-0 opacity-70 dark:opacity-40"
                            style={{
                                backgroundImage: `
                                    radial-gradient(circle at top right, rgba(124, 92, 255, 0.12), transparent 70%),
                                    radial-gradient(circle at bottom left, rgba(56, 189, 248, 0.08), transparent 60%)
                                `,
                            }}
                        />

                        <div className="relative z-10 flex flex-col gap-2">
                            <button
                                onClick={() => window.history.back()}
                                className="mb-1 flex items-center gap-1.5 text-xs font-semibold tracking-wider text-slate-500 uppercase transition-colors hover:text-[#3B28F6] dark:text-slate-400 dark:hover:text-[#7C5CFF]"
                            >
                                <ArrowLeft size={14} /> Back
                            </button>

                            {/* Badge */}
                            <div className="inline-flex w-fit items-center gap-1.5 rounded border border-[rgba(59,40,246,0.2)] bg-[rgba(59,40,246,0.06)] px-2.5 py-1 dark:border-[rgba(59,40,246,0.35)] dark:bg-[rgba(59,40,246,0.1)]">
                                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#3B28F6]" />
                                <span className="text-[10px] font-bold tracking-[0.12em] text-[#3B28F6] uppercase">
                                    Module View
                                </span>
                            </div>

                            <h1
                                className="m-0 text-2xl leading-none font-bold tracking-tight text-[#3B28F6] sm:text-3xl dark:text-[#7C5CFF]"
                                style={{
                                    fontFamily: 'Orbitron, sans-serif',
                                }}
                            >
                                {module.title}
                            </h1>
                        </div>
                    </header>

                    {/* CONTENT LIST */}
                    <div className="flex flex-col gap-4">
                        {module.contents.map((item: any, index: number) => {
                            return (
                                <div
                                    key={index}
                                    className="group relative rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800/80 dark:bg-[#060B1A]/80"
                                >
                                    {/* Top accent line */}
                                    <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent dark:via-slate-800" />

                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-white/5">
                                            <span className="text-slate-455 text-xs font-bold tracking-wider uppercase dark:text-slate-500">
                                                Block #{index + 1} ({item.type})
                                            </span>
                                        </div>

                                        {item.type === 'image' &&
                                            item.content?.url && (
                                                <div className="flex justify-center rounded-xl bg-black/5 p-2 dark:bg-black/60">
                                                    <img
                                                        src={item.content.url}
                                                        className="h-auto max-h-96 max-w-full rounded-lg object-contain"
                                                        alt="Module content"
                                                    />
                                                </div>
                                            )}

                                        {item.type !== 'image' &&
                                            item.content?.url && (
                                                <div className="dark:border-slate-850 flex w-fit items-center gap-2.5 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:bg-slate-900/50">
                                                    <FileText
                                                        size={20}
                                                        className="text-[#3B28F6] dark:text-[#7C5CFF]"
                                                    />
                                                    <a
                                                        href={item.content.url}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="text-sm font-semibold text-[#3B28F6] hover:underline dark:text-[#7C5CFF]"
                                                    >
                                                        📄{' '}
                                                        {item.content.name ||
                                                            'Attached File'}
                                                    </a>
                                                </div>
                                            )}
                                    </div>
                                </div>
                            );
                        })}

                        {module.contents.length === 0 && (
                            <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm dark:border-slate-800 dark:bg-[#060B1A]/40">
                                <p className="font-medium text-slate-500 dark:text-slate-400">
                                    No content in this module
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
