import AppLayout from "@/layouts/app-layout";
import { router } from "@inertiajs/react";

export default function ModuleIndex({ path }: any) {
    const pathId = path._id?.$oid || path._id || path.id;
    return (
        <AppLayout>
            <div className="relative min-h-screen bg-[#030712] text-white p-6 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] pointer-events-none select-none bg-[radial-gradient(circle_at_top_center,rgba(124,92,255,0.12),transparent_50%)] z-0" />

                <div className="relative z-10 max-w-5xl mx-auto flex flex-col gap-6">

                    {/* HEADER */}
                    <div className="flex justify-between items-center bg-[#060B1A]/80 border border-white/8 p-6 rounded-xl backdrop-blur-sm shadow-md">
                        <div>
                            <h1 className="text-2xl font-bold text-white">
                                Module Management
                            </h1>
                            <p className="text-sm text-slate-400 mt-1 font-medium">
                                Path: {path.name}
                            </p>
                        </div>

                        {/* ADD MODULE */}
                        <button
                            onClick={() =>
                                router.visit(`/admin/modules/create?path_id=${pathId}`)
                            }
                            className="bg-gradient-to-r from-[#7C5CFF] to-[#8B5CF6] hover:from-[#8B5CF6] hover:to-[#7C5CFF] transition px-5 py-2.5 rounded-lg font-semibold text-sm shadow-md text-white"
                        >
                            + Add Module
                        </button>
                    </div>

                    {/* EMPTY STATE */}
                    {path.modules.length === 0 && (
                        <div className="bg-[#060B1A]/40 border border-white/8 rounded-xl p-8 text-center">
                            <p className="text-slate-400 text-sm font-medium">
                                Belum ada module di path ini
                            </p>
                        </div>
                    )}

                    {/* MODULE LIST */}
                    <div className="grid md:grid-cols-2 gap-4">
                        {path.modules.map((module: any, index: number) => (
                            <div
                                key={module._id}
                                className="bg-[#060B1A]/80 backdrop-blur-sm border border-white/8 rounded-xl p-5 flex flex-col gap-4 hover:border-[#7C5CFF]/50 hover:shadow-lg hover:shadow-[#7C5CFF]/5 transition duration-200 ease-out"
                            >

                                {/* TOP */}
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 tracking-wider uppercase mb-1">
                                            Module #{index + 1}
                                        </p>
                                        <h2 className="font-bold text-lg leading-tight text-white">
                                            {module.title}
                                        </h2>
                                    </div>

                                    <span className="text-xs bg-white/5 border border-white/5 text-slate-300 px-2.5 py-1 rounded-lg font-medium">
                                        {module.contents?.length || 0} contents
                                    </span>
                                </div>

                                {/* ACTION */}
                                <div className="flex justify-between items-center mt-auto pt-3 border-t border-white/5">

                                    <button
                                        onClick={() =>
                                            router.visit(`/admin/modules/${module.slug}`)
                                        }
                                        className="text-[#7C5CFF] hover:text-[#8B5CF6] text-xs font-semibold transition-colors"
                                    >
                                        Detail
                                    </button>

                                    <button
                                        onClick={() => {
                                            if (confirm("Yakin hapus module ini?")) {
                                                router.delete(`/modules/${module.slug}`);
                                            }
                                        }}
                                        className="text-rose-400 hover:text-rose-350 text-xs font-semibold transition-colors"
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