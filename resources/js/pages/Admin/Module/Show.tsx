import AppLayout from "@/layouts/app-layout";
import { router } from "@inertiajs/react";
import { Trash2, Plus, FileText, Video, Image as ImageIcon } from "lucide-react";

export default function ModuleShow({ module }: any) {

    const getYoutubeId = (url: string) => {
        const regExp = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/;
        const match = url.match(regExp);
        return match ? match[1] : null;
    };

    const renderContent = (item: any) => {
        const url = item.content?.url;

        switch (item.type) {

            case "text":
                return (
                    <div className="flex flex-col gap-2">
                        <h2 className="font-semibold text-lg text-white">
                            {item.content.title}
                        </h2>
                        <p className="text-sm text-gray-300 leading-relaxed">
                            {item.content.description}
                        </p>
                    </div>
                );

            case "image":
                return (
                    <img
                        src={url}
                        className="w-full h-64 object-cover rounded-xl"
                    />
                );

            case "video":
                return (
                    <video controls className="w-full rounded-xl max-h-64">
                        <source src={url} />
                    </video>
                );

            case "youtube":
                const id = getYoutubeId(url);
                return (
                    <iframe
                        className="w-full h-64 rounded-xl"
                        src={`https://www.youtube.com/embed/${id}`}
                        allowFullScreen
                    />
                );

            default:
                return (
                    <a
                        href={url}
                        target="_blank"
                        className="text-blue-400 hover:underline text-sm"
                    >
                        📄 Download File
                    </a>
                );
        }
    };

    return (
        <AppLayout>
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-[#0f172a] to-slate-900 text-white p-6">

                <div className="max-w-5xl mx-auto flex flex-col gap-8">

                    {/* HEADER */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">
                                {module.title}
                            </h1>
                            <p className="text-gray-400 text-sm mt-1">
                                Manage your module content blocks
                            </p>
                        </div>

                        {/* ADD CONTENT */}
                        <button
                            onClick={() =>
                                router.visit(`/admin/modules/create?path_id=${module.path_id}`)
                            }
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow-lg transition"
                        >
                            <Plus size={16} />
                            Add Content
                        </button>
                    </div>

                    {/* CONTENT LIST */}
                    <div className="flex flex-col gap-6">

                        {module.contents.length === 0 && (
                            <div className="border border-slate-800 rounded-xl p-10 text-center bg-slate-900/50 backdrop-blur">
                                <p className="text-gray-400">
                                    Belum ada content di module ini
                                </p>
                            </div>
                        )}

                        {module.contents.map((item: any, index: number) => (
                            <div
                                key={item._id}
                                className="group relative border border-slate-800 rounded-2xl p-5 bg-slate-900/60 backdrop-blur hover:border-blue-500 transition-all duration-300 shadow-lg hover:shadow-blue-500/10"
                            >

                                {/* ORDER BADGE */}
                                <div className="absolute -left-3 top-4 bg-blue-600 text-xs px-2 py-1 rounded-full shadow">
                                    {index + 1}
                                </div>

                                {/* CONTENT */}
                                <div className="flex flex-col gap-4">

                                    {renderContent(item)}

                                    {/* FOOTER */}
                                    <div className="flex justify-between items-center mt-2">

                                        <span className="text-xs uppercase text-gray-400 tracking-wide">
                                            {item.type}
                                        </span>

                                        {/* DELETE */}
                                        <button
                                            onClick={() => {
                                                if (confirm("Hapus content ini?")) {
                                                    router.delete(`/admin/module-contents/${item._id}`);
                                                }
                                            }}
                                            className="flex items-center gap-1 text-red-400 text-xs opacity-70 hover:opacity-100 transition"
                                        >
                                            <Trash2 size={14} />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}