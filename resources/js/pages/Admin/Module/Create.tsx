import { useState } from "react";
import { router } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Layers, Upload, X, FileText, Image as ImageIcon, Video, ArrowLeft } from "lucide-react";

type Props = {
    pathId: string;
};

export default function CreateModule({ pathId }: Props) {
    const [title, setTitle] = useState("");
    const [files, setFiles] = useState<File[]>([]);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    };

    const removeFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const detectType = (file: File) => {
        if (file.type.startsWith("image")) return "image";
        if (file.type.startsWith("video")) return "video";
        return "file";
    };

    const getFileIcon = (file: File) => {
        const type = detectType(file);
        if (type === "image") return <ImageIcon size={20} className="text-emerald-400" />;
        if (type === "video") return <Video size={20} className="text-purple-400" />;
        return <FileText size={20} className="text-amber-400" />;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) {
            alert("Title wajib diisi");
            return;
        }

        const formData = new FormData();

        formData.append("title", title);
        formData.append("path_id", pathId);

        files.forEach((file, index) => {
            formData.append(`contents[${index}][file]`, file);
            formData.append(`contents[${index}][type]`, detectType(file));
        });

        setLoading(true);

        router.post("/admin/modules", formData, {
            forceFormData: true,
            onFinish: () => setLoading(false),
            onError: (err) => {
                console.log(err);
                alert("Terjadi error");
            },
        });
    };

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
                                className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-[#3B28F6] dark:hover:text-[#7C5CFF] transition-colors text-xs font-semibold uppercase tracking-wider mb-2"
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
                                    Modules
                                </span>
                            </div>

                            <h1
                                className="m-0 text-2xl sm:text-3xl font-bold leading-none tracking-tight text-[#3B28F6] dark:text-[#7C5CFF]"
                                style={{
                                    fontFamily: "Orbitron, sans-serif",
                                }}
                            >
                                Create New Module
                            </h1>
                            <p className="m-0 text-xs sm:text-sm dark:text-slate-400/70 text-slate-600/75">
                                Add a new learning module with images, videos, or files.
                            </p>
                        </div>
                    </header>

                    {/* FORM */}
                    <form
                        onSubmit={handleSubmit}
                        className="relative z-10 bg-white dark:bg-[#060B1A]/80 border border-slate-200 dark:border-white/8 rounded-xl overflow-hidden shadow-sm"
                    >
                        {/* Top accent line */}
                        <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent dark:via-slate-800" />

                        <div className="p-6 sm:p-8 space-y-6">
                            
                            {/* TITLE */}
                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.15em] ml-1">
                                    Module Title <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Introduction to React Fundamentals"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 dark:bg-slate-950 dark:border-slate-800 px-4 py-3.5 rounded-xl text-slate-900 dark:text-white outline-none focus:border-[#3B28F6] dark:focus:border-[#7C5CFF] focus:ring-1 focus:ring-[#3B28F6] dark:focus:ring-[#7C5CFF] transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                                    required
                                />
                            </div>

                            {/* FILE INPUT */}
                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.15em] ml-1">
                                    Upload Content Files (Optional)
                                </label>
                                
                                <div className="relative group">
                                    <input
                                        type="file"
                                        multiple
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                    <div className="w-full bg-slate-50/50 dark:bg-slate-950/30 border-2 border-dashed border-slate-200 dark:border-slate-800 group-hover:border-[#3B28F6]/50 dark:hover:border-[#7C5CFF]/50 group-hover:bg-[#3B28F6]/5 dark:group-hover:bg-[#7C5CFF]/5 rounded-xl p-8 transition-all duration-200 text-center flex flex-col items-center justify-center gap-3">
                                        <div className="p-3 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl group-hover:scale-110 transition-transform duration-300">
                                            <Upload className="text-slate-500 dark:text-slate-400 group-hover:text-[#3B28F6] dark:hover:text-[#7C5CFF]" size={24} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-350 group-hover:text-[#3B28F6] dark:group-hover:text-[#7C5CFF]">Click to upload or drag and drop</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-550 mt-1">Images, Videos, PDFs, or other documents</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* PREVIEW FILE */}
                            {files.length > 0 && (
                                <div className="space-y-3 pt-6 border-t border-slate-150 dark:border-slate-800/80">
                                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.15em] ml-1 flex items-center justify-between">
                                        <span>Selected Files ({files.length})</span>
                                        <button 
                                            type="button"
                                            onClick={() => setFiles([])}
                                            className="text-xs text-rose-500 hover:text-rose-650 font-bold transition-colors uppercase tracking-wider"
                                        >
                                            Clear All
                                        </button>
                                    </p>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                        {files.map((file, i) => (
                                            <div
                                                key={i}
                                                className="flex items-center gap-3 bg-slate-50/50 dark:bg-slate-950/50 p-3 rounded-xl border border-slate-150 dark:border-slate-800 group relative"
                                            >
                                                <div className="p-2 bg-slate-100 dark:bg-slate-900 rounded-lg shrink-0 border border-slate-200 dark:border-slate-800">
                                                    {getFileIcon(file)}
                                                </div>
                                                <div className="flex flex-col min-w-0 flex-1 pr-6">
                                                    <span className="text-sm text-slate-800 dark:text-slate-200 truncate font-semibold">{file.name}</span>
                                                    <span className="text-xs text-slate-500 dark:text-slate-500 mt-0.5">
                                                        {(file.size / 1024).toFixed(2)} KB
                                                    </span>
                                                </div>
                                                
                                                <button
                                                    type="button"
                                                    onClick={() => removeFile(i)}
                                                    className="absolute right-3 p-1.5 text-slate-400 hover:text-rose-550 dark:text-slate-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                                    title="Remove File"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* SUBMIT */}
                        <div className="p-6 sm:p-8 bg-slate-50/50 dark:bg-slate-950/50 border-t border-slate-150 dark:border-slate-850 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => window.history.back()}
                                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-850 transition-colors border border-slate-200 dark:border-slate-700 sm:border-transparent"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading || !title.trim()}
                                className="flex items-center gap-2 bg-[#3B28F6] hover:bg-[#2a1ce0] disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md shadow-[#3B28F6]/10"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating...
                                    </>
                                ) : "Create Module"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}