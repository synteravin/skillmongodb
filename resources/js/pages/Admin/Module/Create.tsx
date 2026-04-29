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
            <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#020617] to-black text-white p-4 sm:p-6 lg:p-8">
                <div className="max-w-3xl mx-auto flex flex-col gap-8">

                    {/* HEADER */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/50 p-6 rounded-2xl border border-slate-800/60 backdrop-blur-xl shadow-lg">
                        <div>
                            <button 
                                onClick={() => window.history.back()}
                                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-4 text-sm font-medium"
                            >
                                <ArrowLeft size={16} /> Back
                            </button>
                            <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
                                <div className="p-2 bg-indigo-500/10 rounded-lg">
                                    <Layers className="text-indigo-400" size={24} />
                                </div>
                                Create New Module
                            </h1>
                            <p className="text-slate-400 text-sm mt-2 ml-1">
                                Add a new learning module with images, videos, or files.
                            </p>
                        </div>
                    </div>

                    {/* FORM */}
                    <form
                        onSubmit={handleSubmit}
                        className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl"
                    >
                        <div className="p-6 sm:p-8 space-y-8">
                            
                            {/* TITLE */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-300 ml-1">
                                    Module Title <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Introduction to React Fundamentals"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full bg-slate-950/50 border border-slate-800 px-4 py-3.5 rounded-xl text-white outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
                                    required
                                />
                            </div>

                            {/* FILE INPUT */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-300 ml-1">
                                    Upload Content Files (Optional)
                                </label>
                                
                                <div className="relative group">
                                    <input
                                        type="file"
                                        multiple
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                    <div className="w-full bg-slate-950/30 border-2 border-dashed border-slate-700 group-hover:border-indigo-500/50 group-hover:bg-indigo-500/5 rounded-2xl p-8 transition-all duration-200 text-center flex flex-col items-center justify-center gap-3">
                                        <div className="p-3 bg-slate-800/80 rounded-xl group-hover:scale-110 transition-transform duration-300">
                                            <Upload className="text-slate-400 group-hover:text-indigo-400" size={24} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-300 group-hover:text-indigo-300">Click to upload or drag and drop</p>
                                            <p className="text-xs text-slate-500 mt-1">Images, Videos, PDFs, or other documents</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* PREVIEW FILE */}
                            {files.length > 0 && (
                                <div className="space-y-3 pt-4 border-t border-slate-800/60">
                                    <p className="text-sm font-medium text-slate-300 ml-1 flex items-center justify-between">
                                        <span>Selected Files ({files.length})</span>
                                        <button 
                                            type="button"
                                            onClick={() => setFiles([])}
                                            className="text-xs text-rose-400 hover:text-rose-300 font-medium"
                                        >
                                            Clear All
                                        </button>
                                    </p>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                        {files.map((file, i) => (
                                            <div
                                                key={i}
                                                className="flex items-center gap-3 bg-slate-950/50 p-3 rounded-xl border border-slate-800 group relative"
                                            >
                                                <div className="p-2 bg-slate-900 rounded-lg shrink-0">
                                                    {getFileIcon(file)}
                                                </div>
                                                <div className="flex flex-col min-w-0 flex-1 pr-6">
                                                    <span className="text-sm text-slate-200 truncate font-medium">{file.name}</span>
                                                    <span className="text-xs text-slate-500">
                                                        {(file.size / 1024).toFixed(2)} KB
                                                    </span>
                                                </div>
                                                
                                                <button
                                                    type="button"
                                                    onClick={() => removeFile(i)}
                                                    className="absolute right-3 p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
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
                        <div className="p-6 sm:p-8 bg-slate-950/50 border-t border-slate-800/80 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => window.history.back()}
                                className="px-6 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading || !title.trim()}
                                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-2.5 rounded-xl text-sm font-medium transition-all shadow-lg shadow-indigo-500/20"
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