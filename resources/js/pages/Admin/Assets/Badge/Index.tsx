import { usePage, Link, router, useForm } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Plus, Edit2, Trash2, X } from "lucide-react";
import { useState, useEffect } from "react";

export default function Index() {
    const { badges } = usePage().props as any;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        order: "",
        icon: null as File | null,
    });

    const handleDelete = (id: string) => {
        if (confirm("Apakah Anda yakin ingin menghapus lencana ini? Tindakan ini tidak dapat dibatalkan.")) {
            router.delete(`/admin/assets/badges/${id}`);
        }
    };

    const handleFile = (file: File | null) => {
        if (!file) return;
        setData("icon", file);
        setPreview(URL.createObjectURL(file));
    };

    // Bersihkan URL object
    useEffect(() => {
        return () => {
            if (preview) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
        if (preview) {
            URL.revokeObjectURL(preview);
            setPreview(null);
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        post("/admin/assets/badges", {
            forceFormData: true,
            onSuccess: () => {
                closeModal();
            },
        });
    };

    return (
        <AppLayout>
            <div className="max-w-5xl mx-auto p-6 space-y-6">

                {/* HEADER */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">Editor Lencana</h1>
                        <p className="text-[11px] font-medium text-slate-400 tracking-wider mt-1 uppercase">Manajemen Aset Lencana Sistem</p>
                    </div>

                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white text-xs font-semibold shadow-[0_4px_14px_rgba(99,102,241,0.4)] transition-all transform hover:-translate-y-0.5"
                    >
                        <Plus size={16} />
                        Tambah Lencana
                    </button>
                </div>

                {/* TABLE CARD */}
                <div className="rounded-2xl overflow-hidden bg-slate-900/80 backdrop-blur-xl border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.04)]">
                    
                    <div className="px-5 py-4 border-b border-white/5 bg-white/[0.02]">
                        <h3 className="text-sm font-semibold text-white">Semua Lencana Aktif</h3>
                    </div>

                    {/* TABLE HEAD */}
                    <div className="hidden md:grid grid-cols-[70px_1fr_120px_120px] px-5 py-3 border-b border-white/5 text-[11px] font-medium text-slate-400 uppercase tracking-wider bg-black/20">
                        <span>Ikon</span>
                        <span>Identitas Lencana</span>
                        <span>Urutan</span>
                        <span className="text-right">Aksi</span>
                    </div>

                    {/* TABLE BODY */}
                    <div className="flex flex-col">
                        {(!badges || badges.length === 0) ? (
                            <div className="p-10 text-center text-slate-500 text-sm">
                                Belum ada lencana yang ditambahkan.
                            </div>
                        ) : (
                            badges.map((badge: any, i: number) => {
                                const id = badge._id ?? badge.id;

                                return (
                                    <div 
                                        key={id ?? i} 
                                        className="grid grid-cols-1 md:grid-cols-[70px_1fr_120px_120px] items-center px-5 py-4 border-b border-white/5 last:border-0 hover:bg-indigo-500/5 transition-colors gap-4 md:gap-0"
                                    >
                                        <div className="flex items-center justify-center md:justify-start">
                                            <div className="w-11 h-11 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center p-1.5 shadow-inner">
                                                <img 
                                                    src={`/storage/${badge.icon}`} 
                                                    alt={badge.name}
                                                    className="w-full h-full object-contain"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex flex-col text-center md:text-left">
                                            <strong className="text-sm font-semibold text-white">{badge.name}</strong>
                                            <p className="text-[11px] text-slate-400 mt-0.5">Aset Sistem Internal</p>
                                        </div>

                                        <div className="flex justify-center md:justify-start">
                                            <span className="bg-white/5 px-3 py-1.5 rounded-lg text-[11px] font-medium text-slate-300 border border-white/5 shadow-sm">
                                                #{badge.order}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-center md:justify-end gap-2">
                                            <Link
                                                href={`/admin/assets/badges/${id}/edit`}
                                                className="p-2 rounded-lg bg-white/5 hover:bg-indigo-500/20 text-slate-400 hover:text-indigo-300 transition-colors border border-transparent hover:border-indigo-500/30"
                                                title="Edit Lencana"
                                            >
                                                <Edit2 size={15} />
                                            </Link>

                                            <button
                                                onClick={() => handleDelete(id)}
                                                className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors border border-transparent hover:border-red-500/30"
                                                title="Hapus Lencana"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

            </div>

            {/* MODAL CREATE */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div 
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={closeModal}
                    ></div>
                    
                    <form 
                        onSubmit={submit} 
                        encType="multipart/form-data" 
                        className="relative w-full max-w-lg bg-slate-900 border border-white/10 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.05)] overflow-hidden"
                    >
                        {/* MODAL HEADER */}
                        <div className="flex justify-between items-center p-5 border-b border-white/5 bg-white/[0.02]">
                            <div>
                                <h2 className="text-base font-semibold text-white">Tambah Lencana Baru</h2>
                                <p className="text-xs text-slate-400 mt-0.5">Unggah aset untuk sistem</p>
                            </div>
                            <button 
                                type="button"
                                onClick={closeModal}
                                className="p-2 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* MODAL BODY */}
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-[110px_1fr] gap-6 items-start">
                                
                                {/* PREVIEW */}
                                <div className="text-center flex flex-col items-center">
                                    <p className="text-[11px] text-slate-400 mb-2 font-medium">Preview</p>

                                    <label 
                                        htmlFor="fileInput"
                                        className="w-[95px] h-[95px] rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 flex items-center justify-center overflow-hidden cursor-pointer mb-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_8px_20px_rgba(0,0,0,0.5)] transition-all hover:-translate-y-0.5 hover:scale-105 hover:shadow-[0_12px_30px_rgba(0,0,0,0.6),0_0_0_1px_rgba(99,102,241,0.3)] group"
                                    >
                                        {preview ? (
                                            <img src={preview} alt="Preview" className="w-[85%] h-[85%] object-contain" />
                                        ) : (
                                            <div className="flex flex-col items-center gap-1 text-slate-500 group-hover:text-indigo-400 transition-colors">
                                                <Plus size={20} />
                                                <span className="text-[10px] font-medium mt-1">Upload</span>
                                            </div>
                                        )}
                                    </label>

                                    <label 
                                        htmlFor="fileInput" 
                                        className="text-[11px] font-medium text-indigo-400 hover:text-indigo-300 cursor-pointer transition-colors"
                                    >
                                        Unggah Ikon
                                    </label>

                                    <input
                                        id="fileInput"
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => {
                                            handleFile(e.target.files?.[0] || null);
                                            e.target.value = '';
                                        }}
                                    />
                                    
                                    {errors.icon && (
                                        <span className="text-red-400 text-[10px] mt-2 block font-medium">{errors.icon}</span>
                                    )}
                                </div>

                                {/* FORM FIELDS */}
                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[11px] font-medium text-slate-400">Nama Lencana</label>
                                        <input
                                            type="text"
                                            placeholder="Misal: Elite Warrior"
                                            value={data.name}
                                            onChange={(e) => setData("name", e.target.value)}
                                            className={`w-full px-3.5 py-2.5 rounded-xl bg-black/40 border ${errors.name ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' : 'border-white/10 focus:border-indigo-500 focus:ring-indigo-500/20'} text-[13px] text-white transition-all placeholder:text-slate-600 focus:outline-none focus:ring-2`}
                                        />
                                        {errors.name && (
                                            <span className="text-red-400 text-[10px] mt-0.5 font-medium">{errors.name}</span>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[11px] font-medium text-slate-400">Urutan Tampilan</label>
                                        <input
                                            type="number"
                                            placeholder="0"
                                            value={data.order}
                                            onChange={(e) => setData("order", e.target.value)}
                                            className={`w-full px-3.5 py-2.5 rounded-xl bg-black/40 border ${errors.order ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' : 'border-white/10 focus:border-indigo-500 focus:ring-indigo-500/20'} text-[13px] text-white transition-all placeholder:text-slate-600 focus:outline-none focus:ring-2`}
                                        />
                                        {errors.order && (
                                            <span className="text-red-400 text-[10px] mt-0.5 font-medium">{errors.order}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* MODAL FOOTER */}
                        <div className="p-5 border-t border-white/5 bg-black/20 flex justify-end gap-3">
                            <button 
                                type="button"
                                onClick={closeModal}
                                disabled={processing}
                                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-medium rounded-xl transition-colors disabled:opacity-50"
                            >
                                Batal
                            </button>
                            <button 
                                type="submit"
                                disabled={processing} 
                                className="px-5 py-2 bg-gradient-to-br from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white text-xs font-medium rounded-xl shadow-[0_4px_14px_rgba(99,102,241,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing ? "Menyimpan..." : "Simpan Lencana"}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </AppLayout>
    );
}