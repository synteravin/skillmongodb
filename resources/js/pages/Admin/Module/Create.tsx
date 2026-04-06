import { useState } from "react";
import { router } from "@inertiajs/react";

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!title) {
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
        <div className="min-h-screen bg-slate-950 text-white p-6">
            <div className="max-w-3xl mx-auto flex flex-col gap-6">

                {/* HEADER */}
                <div>
                    <h1 className="text-2xl font-bold">Create Module</h1>
                    <p className="text-sm text-gray-400">
                        Tambahkan materi berupa image, video, atau file
                    </p>
                </div>

                {/* FORM */}
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-4 bg-slate-900 p-6 rounded-xl border border-slate-800"
                >
                    {/* TITLE */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-400">Module Title</label>
                        <input
                            type="text"
                            placeholder="Contoh: Introduction to React"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="bg-slate-800 border border-slate-700 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* FILE INPUT */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-400">Upload Content</label>

                        <input
                            type="file"
                            multiple
                            onChange={handleFileChange}
                            className="bg-slate-800 border border-slate-700 p-2 rounded"
                        />

                        <p className="text-xs text-gray-500">
                            Bisa upload image, video, atau dokumen
                        </p>
                    </div>

                    {/* PREVIEW FILE */}
                    {files.length > 0 && (
                        <div className="flex flex-col gap-3">
                            <p className="text-sm text-gray-400">Preview Content</p>

                            {files.map((file, i) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-between bg-slate-800 p-3 rounded border border-slate-700"
                                >
                                    <div className="flex flex-col">
                                        <span className="text-sm">{file.name}</span>
                                        <span className="text-xs text-gray-500">
                                            {(file.size / 1024).toFixed(2)} KB
                                        </span>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => removeFile(i)}
                                        className="text-red-400 text-xs hover:underline"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* SUBMIT */}
                    <button
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 transition p-3 rounded font-semibold disabled:opacity-50"
                    >
                        {loading ? "Creating..." : "Create Module"}
                    </button>
                </form>
            </div>
        </div>
    );
}