import AppLayout from '@/layouts/app-layout';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import ConfirmModal from '@/components/ui/ConfirmModal';

export default function ModuleIndex({ path }: any) {
    const pathId = path._id?.$oid || path._id || path.id;
    const [confirmModal, setConfirmModal] = useState<{
        open: boolean;
        title: string;
        message: string;
        confirmText: string;
        variant: 'danger' | 'info' | 'primary';
        onConfirm: () => void;
    }>({
        open: false,
        title: '',
        message: '',
        confirmText: 'Confirm',
        variant: 'danger',
        onConfirm: () => {},
    });

    const handleDeleteModule = (module: any) => {
        const moduleId = module._id?.$oid || module._id || module.id;
        setConfirmModal({
            open: true,
            title: 'Hapus Modul',
            message: `Apakah Anda yakin ingin menghapus modul "${module.title}"?`,
            confirmText: 'Hapus Modul',
            variant: 'danger',
            onConfirm: () => {
                router.delete(`/admin/modules/${moduleId}`);
            },
        });
    };

    return (
        <AppLayout>
            <div className="relative min-h-screen overflow-hidden bg-[#030712] p-6 text-white">
                <div className="pointer-events-none absolute top-0 left-1/2 z-0 h-[400px] w-full max-w-7xl -translate-x-1/2 bg-[radial-gradient(circle_at_top_center,rgba(124,92,255,0.12),transparent_50%)] select-none" />

                <div className="relative z-10 mx-auto flex w-full flex-col gap-6">
                    {/* HEADER */}
                    <div className="flex items-center justify-between rounded-xl border border-white/8 bg-[#060B1A]/80 p-6 shadow-md backdrop-blur-sm">
                        <div>
                            <h1 className="text-2xl font-bold text-white">
                                Module Management
                            </h1>
                            <p className="mt-1 text-sm font-medium text-slate-400">
                                Path: {path.name}
                            </p>
                        </div>

                        {/* ADD MODULE */}
                        <button
                            onClick={() =>
                                router.visit(
                                    `/admin/modules/create?path_id=${pathId}`,
                                )
                            }
                            className="rounded-lg bg-gradient-to-r from-[#7C5CFF] to-[#8B5CF6] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:from-[#8B5CF6] hover:to-[#7C5CFF]"
                        >
                            + Add Module
                        </button>
                    </div>

                    {/* EMPTY STATE */}
                    {path.modules.length === 0 && (
                        <div className="rounded-xl border border-white/8 bg-[#060B1A]/40 p-8 text-center">
                            <p className="text-sm font-medium text-slate-400">
                                Belum ada module di path ini
                            </p>
                        </div>
                    )}

                    {/* MODULE LIST */}
                    <div className="grid gap-4 md:grid-cols-2">
                        {path.modules.map((module: any, index: number) => (
                            <div
                                key={module._id}
                                className="flex flex-col gap-4 rounded-xl border border-white/8 bg-[#060B1A]/80 p-5 backdrop-blur-sm transition duration-200 ease-out hover:border-[#7C5CFF]/50 hover:shadow-lg hover:shadow-[#7C5CFF]/5"
                            >
                                {/* TOP */}
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="mb-1 text-xs font-semibold tracking-wider text-slate-500 uppercase">
                                            Module #{index + 1}
                                        </p>
                                        <h2 className="text-lg leading-tight font-bold text-white">
                                            {module.title}
                                        </h2>
                                    </div>

                                    <span className="rounded-lg border border-white/5 bg-white/5 px-2.5 py-1 text-xs font-medium text-slate-300">
                                        {module.contents?.length || 0} contents
                                    </span>
                                </div>

                                {/* ACTION */}
                                <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-3">
                                    <button
                                        onClick={() =>
                                            router.visit(
                                                `/admin/modules/${module.slug}`,
                                            )
                                        }
                                        className="text-xs font-semibold text-[#7C5CFF] transition-colors hover:text-[#8B5CF6]"
                                    >
                                        Detail
                                    </button>

                                    <button
                                        onClick={() =>
                                            handleDeleteModule(module)
                                        }
                                        className="hover:text-rose-350 text-xs font-semibold text-rose-400 transition-colors"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <ConfirmModal
                open={confirmModal.open}
                onClose={() =>
                    setConfirmModal((prev) => ({ ...prev, open: false }))
                }
                onConfirm={confirmModal.onConfirm}
                title={confirmModal.title}
                message={confirmModal.message}
                confirmText={confirmModal.confirmText}
                variant={confirmModal.variant}
            />
        </AppLayout>
    );
}
