import AppLayout from "@/layouts/app-layout";
import { ArrowLeft, FileText } from "lucide-react";

export default function ModuleShow({ module }: any) {
    return (
        <AppLayout>
            <div 
                className="relative min-h-screen bg-[#f8fafc] dark:bg-[#030712] text-slate-800 dark:text-white px-4 py-8 sm:px-6 lg:px-10 overflow-hidden transition-colors duration-200"
                style={{ fontFamily: "'Outfit', sans-serif" }}
            >
                {/* Subtle top-center ambient glow (visible on dark mode) */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] pointer-events-none select-none z-0 bg-indigo-500/5 dark:bg-indigo-500/5 rounded-full blur-[120px]" />

                <div className="relative z-10 w-full mx-auto flex flex-col gap-6">

                    {/* HEADER */}
                    <header
                        className="relative overflow-hidden rounded-xl px-6 py-5 bg-[#f5f6ff] dark:bg-[#0d0f17] border border-slate-200 dark:border-white/5"
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

                        <div className="relative z-10 flex flex-col gap-2">
                            <button 
                                onClick={() => window.history.back()}
                                className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-[#3B28F6] dark:hover:text-[#7C5CFF] transition-colors text-xs font-semibold uppercase tracking-wider mb-1"
                            >
                                <ArrowLeft size={14} /> Back
                            </button>

                            {/* Badge */}
                            <div className="inline-flex w-fit items-center gap-1.5 rounded border px-2.5 py-1
                                dark:border-[rgba(59,40,246,0.35)] dark:bg-[rgba(59,40,246,0.1)]
                                border-[rgba(59,40,246,0.2)] bg-[rgba(59,40,246,0.06)]"
                            >
                                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#3B28F6]" />
                                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#3B28F6]">
                                    Module View
                                </span>
                            </div>

                            <h1
                                className="m-0 text-2xl sm:text-3xl font-bold leading-none tracking-tight text-[#3B28F6] dark:text-[#7C5CFF]"
                                style={{
                                    fontFamily: "Orbitron, sans-serif",
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
                                    className="group relative border border-slate-200 dark:border-slate-800/80 rounded-xl p-5 bg-white dark:bg-[#060B1A]/80 shadow-sm"
                                >
                                    {/* Top accent line */}
                                    <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent dark:via-slate-800" />

                                    <div className="flex flex-col gap-4">
                                        <div className="flex justify-between items-center border-b border-slate-100 dark:border-white/5 pb-2.5">
                                            <span className="text-xs font-bold text-slate-455 dark:text-slate-500 uppercase tracking-wider">
                                                Block #{index + 1} ({item.type})
                                            </span>
                                        </div>

                                        {item.type === "image" && item.content?.url && (
                                            <div className="flex justify-center bg-black/5 dark:bg-black/60 rounded-xl p-2">
                                                <img 
                                                    src={item.content.url} 
                                                    className="max-w-full h-auto max-h-96 object-contain rounded-lg"
                                                    alt="Module content" 
                                                />
                                            </div>
                                        )}

                                        {item.type === "video" && item.content?.url && (
                                            <div className="flex justify-center bg-black/10 dark:bg-black/80 rounded-xl p-2">
                                                <video controls className="max-w-full rounded-lg max-h-96 w-auto">
                                                    <source src={item.content.url} />
                                                </video>
                                            </div>
                                        )}

                                        {item.type !== "image" && item.type !== "video" && item.content?.url && (
                                            <div className="flex items-center gap-2.5 p-3 rounded-lg border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-900/50 w-fit">
                                                <FileText size={20} className="text-[#3B28F6] dark:text-[#7C5CFF]" />
                                                <a 
                                                    href={item.content.url} 
                                                    target="_blank" 
                                                    rel="noreferrer"
                                                    className="text-[#3B28F6] dark:text-[#7C5CFF] hover:underline text-sm font-semibold"
                                                >
                                                    📄 {item.content.name || "Attached File"}
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}

                        {module.contents.length === 0 && (
                            <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-10 text-center bg-white dark:bg-[#060B1A]/40 shadow-sm">
                                <p className="text-slate-500 dark:text-slate-400 font-medium">
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