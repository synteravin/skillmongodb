import AppLayout from "@/layouts/app-layout";
import { router } from "@inertiajs/react";

export default function ModuleIndex({ path }: any) {
    const pathId = path._id?.$oid || path._id || path.id;
    return (
        <AppLayout>
            <div className="min-h-screen bg-slate-950 text-white p-6">

                <div className="max-w-5xl mx-auto flex flex-col gap-6">

                    {/* HEADER */}
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold">
                                Module Management
                            </h1>
                            <p className="text-sm text-gray-400">
                                Path: {path.name}
                            </p>
                        </div>

                        {/* ADD MODULE */}
                        <button
                            onClick={() =>
                                router.visit(`/admin/modules/create?path_id=${pathId}`)
                            }
                            className="bg-blue-600 hover:bg-blue-700 transition px-4 py-2 rounded font-semibold"
                        >
                            + Add Module
                        </button>
                    </div>

                    {/* EMPTY STATE */}
                    {path.modules.length === 0 && (
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center">
                            <p className="text-gray-400 text-sm">
                                Belum ada module di path ini
                            </p>
                        </div>
                    )}

                    {/* MODULE LIST */}
                    <div className="grid md:grid-cols-2 gap-4">
                        {path.modules.map((module: any, index: number) => (
                            <div
                                key={module._id}
                                className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-3 hover:border-blue-500 transition"
                            >

                                {/* TOP */}
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm text-gray-400">
                                            Module #{index + 1}
                                        </p>
                                        <h2 className="font-bold text-lg leading-tight">
                                            {module.title}
                                        </h2>
                                    </div>

                                    <span className="text-xs bg-slate-800 px-2 py-1 rounded">
                                        {module.contents?.length || 0} contents
                                    </span>
                                </div>

                                {/* ACTION */}
                                <div className="flex justify-between items-center mt-auto">

                                    <button
                                        onClick={() =>
                                            router.visit(`/admin/modules/${module.slug}`)
                                        }
                                        className="text-blue-400 text-xs hover:underline"
                                    >
                                        Detail
                                    </button>

                                    <button
                                        onClick={() => {
                                            if (confirm("Yakin hapus module ini?")) {
                                                router.delete(`/modules/${module.slug}`);
                                            }
                                        }}
                                        className="text-red-400 text-xs hover:underline"
                                    >
                                        Delete
                                    </button>

                                </div>

                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </AppLayout>
    );
}