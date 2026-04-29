import { useForm } from "@inertiajs/react";
import { useState, useEffect } from "react";

export default function CreateBadge() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        order: "",
        icon: null as File | null,
    });

    const [preview, setPreview] = useState<string | null>(null);

    const handleFile = (file: File | null) => {
        if (!file) return;
        setData("icon", file);
        setPreview(URL.createObjectURL(file));
    };

    // Bersihkan URL object untuk mencegah memory leak
    useEffect(() => {
        return () => {
            if (preview) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        post("/admin/assets/badges", {
            forceFormData: true,
            onSuccess: () => {
                reset();
                if (preview) URL.revokeObjectURL(preview);
                setPreview(null);
            },
        });
    };

    return (
        <form
            onSubmit={submit}
            encType="multipart/form-data"
            className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5 mb-4 shadow-[0_10px_30px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.05)]"
        >
            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-base font-semibold text-white">Editor Lencana</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Tambah atau perbarui aset</p>
                </div>

                <button
                    disabled={processing}
                    className="px-4 py-2 bg-gradient-to-br from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white text-xs font-medium rounded-xl shadow-[0_4px_14px_rgba(99,102,241,0.4)] transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                    {processing ? "Menyimpan..." : "Simpan"}
                </button>
            </div>

            {/* CONTENT */}
            <div className="grid grid-cols-1 md:grid-cols-[110px_1fr] gap-5 items-start">

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
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" x2="12" y1="3" y2="15" /></svg>
                                <span className="text-[10px] font-medium mt-1">Upload</span>
                            </div>
                        )}
                    </label>

                    {/* Membungkus label agar dapat diklik untuk memilih gambar */}
                    <label
                        htmlFor="fileInput"
                        className="text-[11px] font-medium text-indigo-400 hover:text-indigo-300 cursor-pointer transition-colors"
                    >
                        Unggah Baru
                    </label>

                    <input
                        id="fileInput"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => {
                            handleFile(e.target.files?.[0] || null);
                            // Mengosongkan value agar pemilihan file yang sama dapat memicu onChange kembali
                            e.target.value = '';
                        }}
                    />

                    {errors.icon && (
                        <span className="text-red-400 text-[10px] mt-2 block font-medium">{errors.icon}</span>
                    )}
                </div>

                {/* FORM */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                        <label className="text-[11px] font-medium text-slate-400">Urutan</label>
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
        </form>
    );
}
