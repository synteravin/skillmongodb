import { useForm, Link } from "@inertiajs/react";
import React, { useState, useEffect } from "react";
import {
    ArrowLeft,
    Save,
    Briefcase,
    DollarSign,
    Calendar,
    FileText,
    Image as ImageIcon,
    Plus,
    Trash2,
    Paperclip,
    FileArchive,
    AlertCircle,
    Award,
    Sparkles,
    CheckCircle,
    Info
} from "lucide-react";

export default function Create({ template }: { template?: any }) {
    const { data, setData, post, processing, errors, transform } = useForm({
        title: template?.title ?? "",
        description: template?.description ?? "",
        min_salary: template?.min_salary ? String(template.min_salary) : "",
        max_salary: template?.max_salary ? String(template.max_salary) : "",
        deadline: "",
        images: [] as File[],
        files: [] as File[],
    });

    const [clientErrors, setClientErrors] = useState<{ images?: string; files?: string }>({});

    // Dynamic RPG rewards estimator states
    const [rewards, setRewards] = useState({ exp: 100, gold: 50, erp: 20, rank: "Bronze" });

    // Calculate rewards dynamically when budget changes
    useEffect(() => {
        const minVal = parseFloat(data.min_salary) || 0;
        const maxVal = parseFloat(data.max_salary) || 0;
        const avgBudget = (minVal + maxVal) / 2;

        // EXP calculation: 100 base + 1 EXP per 10k IDR budget, max 1000
        const exp = Math.min(1000, Math.max(100, Math.round(100 + avgBudget * 0.0001)));
        
        // Gold calculation: 50 base + 1 Gold per 20k IDR max budget, max 500
        const gold = Math.min(500, Math.max(50, Math.round(50 + maxVal * 0.00005)));
        
        // ERP calculation: 20 base + 1 ERP per 50k IDR avg budget, max 200
        const erp = Math.min(200, Math.max(20, Math.round(20 + avgBudget * 0.00002)));

        let rank = "Bronze";
        if (maxVal >= 10000000) {
            rank = "Mythic";
        } else if (maxVal >= 5000000) {
            rank = "Diamond";
        } else if (maxVal >= 2500000) {
            rank = "Gold";
        } else if (maxVal >= 1000000) {
            rank = "Silver";
        }

        setRewards({ exp, gold, erp, rank });
    }, [data.min_salary, data.max_salary]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const selected = Array.from(e.target.files);
        const validImages: File[] = [];
        let errorMsg = "";

        selected.forEach((file) => {
            if (file.size > 2 * 1024 * 1024) {
                errorMsg = `Gambar "${file.name}" melebihi batas 2MB.`;
            } else if (!file.type.startsWith("image/")) {
                errorMsg = `Berkas "${file.name}" harus berupa gambar.`;
            } else {
                validImages.push(file);
            }
        });

        if (errorMsg) {
            setClientErrors((prev) => ({ ...prev, images: errorMsg }));
        } else {
            setClientErrors((prev) => ({ ...prev, images: undefined }));
        }

        if (validImages.length > 0) {
            setData("images", [...data.images, ...validImages]);
        }
        e.target.value = "";
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const selected = Array.from(e.target.files);
        const validFiles: File[] = [];
        let errorMsg = "";
        const allowedExtensions = ["pdf", "doc", "docx", "xls", "xlsx", "zip"];

        selected.forEach((file) => {
            const ext = file.name.split(".").pop()?.toLowerCase();
            if (file.size > 10 * 1024 * 1024) {
                errorMsg = `Berkas "${file.name}" melebihi batas 10MB.`;
            } else if (!ext || !allowedExtensions.includes(ext)) {
                errorMsg = `Ekstensi berkas "${file.name}" tidak diizinkan. Gunakan PDF, Word, Excel, atau ZIP.`;
            } else {
                validFiles.push(file);
            }
        });

        if (errorMsg) {
            setClientErrors((prev) => ({ ...prev, files: errorMsg }));
        } else {
            setClientErrors((prev) => ({ ...prev, files: undefined }));
        }

        if (validFiles.length > 0) {
            setData("files", [...data.files, ...validFiles]);
        }
        e.target.value = "";
    };

    const removeImage = (index: number) => {
        const updated = [...data.images];
        updated.splice(index, 1);
        setData("images", updated);
    };

    const removeFile = (index: number) => {
        const updated = [...data.files];
        updated.splice(index, 1);
        setData("files", updated);
    };

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const dm = 2;
        const sizes = ["Bytes", "KB", "MB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
    };

    const getFileIcon = (fileName: string) => {
        const ext = fileName.split(".").pop()?.toLowerCase();
        if (ext === "zip") return <FileArchive className="w-5 h-5 text-amber-500" />;
        return <FileText className="w-5 h-5 text-indigo-500" />;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        transform((data) => ({
            ...data,
            deadline: data.deadline ? new Date(data.deadline).toISOString() : '',
        }));
        post("/student/quests");
    };

    return (
        <div 
            className="min-h-screen bg-slate-50 dark:bg-[#060813] text-slate-800 dark:text-white flex flex-col p-3 sm:p-6 md:p-8 relative overflow-x-hidden transition-colors duration-205"
            style={{ fontFamily: "'Outfit', sans-serif" }}
        >
            {/* Ambient top-center glow */}
            <div className="pointer-events-none absolute top-0 left-1/2 z-0 h-[450px] w-full max-w-7xl -translate-x-1/2 rounded-full bg-indigo-500/5 blur-[120px] select-none" />

            <div className="w-full max-w-6xl mx-auto relative z-10 flex-1 flex flex-col min-h-0 space-y-6">
                
                {/* HEADER */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800/80 pb-5">
                    <div className="space-y-1">
                        <Link
                            href="/student/quests"
                            className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-slate-500 uppercase transition-colors hover:text-indigo-650 dark:text-slate-400 dark:hover:text-indigo-400 font-['Orbitron']"
                        >
                            <ArrowLeft size={14} />
                            Kembali ke Quest Board
                        </Link>
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-['Oxanium'] flex items-center gap-2">
                            <Sparkles className="w-6 h-6 text-indigo-500 animate-pulse" />
                            POSTING QUEST BARU
                        </h2>
                    </div>
                </div>

                {/* TWO-COLUMN FORM LAYOUT */}
                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* LEFT COLUMN: Main Form details (lg:col-span-8) */}
                    <div className="space-y-6 lg:col-span-8">
                        
                        {/* Card 1: Informasi Utama */}
                        <div className="bg-white/70 dark:bg-[#0c122c]/40 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800/80 p-6 shadow-md space-y-5 transition-all duration-300">
                            <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
                                <Briefcase className="w-5 h-5 text-indigo-500" />
                                <h3 className="text-xs font-black uppercase font-['Orbitron'] text-slate-700 dark:text-blue-200 tracking-wider">
                                    Informasi Utama Pekerjaan
                                </h3>
                            </div>

                            {/* Job Title */}
                            <div className="space-y-2">
                                <label className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider font-['Orbitron']">
                                    Judul Quest / Pekerjaan <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Contoh: Membuat Landing Page Next.js dengan Tailwind CSS"
                                    value={data.title}
                                    onChange={(e) => setData("title", e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-xs sm:text-sm text-slate-805 dark:text-white font-['Oxanium'] transition-colors"
                                />
                                {errors.title && (
                                    <p className="text-xs text-red-500 font-semibold mt-1 font-['Oxanium']">{errors.title}</p>
                                )}
                            </div>

                            {/* Job Description */}
                            <div className="space-y-2">
                                <label className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider font-['Orbitron']">
                                    Detail Kebutuhan Pekerjaan <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    required
                                    placeholder="Jelaskan secara rinci spesifikasi pekerjaan, teknologi yang digunakan, serta kriteria hasil pengerjaan (output) yang diharapkan..."
                                    rows={8}
                                    value={data.description}
                                    onChange={(e) => setData("description", e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-xs sm:text-sm text-slate-805 dark:text-white font-['Oxanium'] leading-relaxed transition-colors"
                                />
                                {errors.description && (
                                    <p className="text-xs text-red-500 font-semibold mt-1 font-['Oxanium']">{errors.description}</p>
                                )}
                            </div>
                        </div>

                        {/* Card 2: Berkas Pendukung & Lampiran */}
                        <div className="bg-white/70 dark:bg-[#0c122c]/40 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800/80 p-6 shadow-md space-y-5 transition-all duration-300">
                            <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
                                <Paperclip className="w-5 h-5 text-indigo-500" />
                                <h3 className="text-xs font-black uppercase font-['Orbitron'] text-slate-700 dark:text-blue-200 tracking-wider">
                                    Berkas & Lampiran Pendukung
                                </h3>
                            </div>

                            {/* Image Uploader */}
                            <div className="space-y-3 font-['Oxanium']">
                                <label className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider font-['Orbitron']">
                                    Unggah Gambar (Maks. 2MB per gambar)
                                </label>

                                {/* Image Preview Grid */}
                                {data.images.length > 0 && (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 mb-3">
                                        {data.images.map((file, index) => (
                                            <div key={index} className="relative group rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-black/20 p-1 flex flex-col items-center">
                                                <img
                                                    src={URL.createObjectURL(file)}
                                                    alt={file.name}
                                                    className="w-full h-20 object-cover rounded-lg"
                                                />
                                                <span className="text-[9px] mt-1 text-slate-500 dark:text-slate-400 truncate w-full text-center px-1">
                                                    {file.name}
                                                </span>
                                                <span className="text-[8px] text-slate-400">
                                                    {formatBytes(file.size)}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(index)}
                                                    className="absolute top-2 right-2 bg-red-650 hover:bg-red-700 text-white p-1 rounded-full opacity-90 transition-all hover:scale-105 cursor-pointer"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="relative">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleImageChange}
                                        id="quest-images-input"
                                        className="hidden"
                                    />
                                    <label
                                        htmlFor="quest-images-input"
                                        className="flex flex-col items-center justify-center gap-1.5 px-4 py-5 rounded-xl border border-dashed border-slate-300 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500/50 bg-slate-50/50 dark:bg-black/15 text-slate-500 dark:text-slate-400 cursor-pointer text-xs transition-all duration-300"
                                    >
                                        <ImageIcon className="w-5 h-5 text-indigo-500 animate-bounce" />
                                        <span className="font-bold text-slate-700 dark:text-slate-350">Seret atau pilih gambar Anda</span>
                                        <span className="text-[10px] text-slate-400">Format JPEG, PNG, WEBP</span>
                                    </label>
                                </div>

                                {clientErrors.images && (
                                    <p className="text-xs text-red-500 font-semibold mt-1 flex items-center gap-1">
                                        <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {clientErrors.images}
                                    </p>
                                )}
                                {errors.images && (
                                    <p className="text-xs text-red-500 font-semibold mt-1">{errors.images}</p>
                                )}
                            </div>

                            {/* Document Uploader */}
                            <div className="space-y-3 font-['Oxanium'] border-t border-slate-100 dark:border-slate-800/60 pt-4">
                                <label className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider font-['Orbitron']">
                                    Dokumen Penunjang (PDF, Word, Excel, ZIP - Maks. 10MB)
                                </label>

                                {/* Selected Documents List */}
                                {data.files.length > 0 && (
                                    <div className="space-y-2 mb-3">
                                        {data.files.map((file, index) => (
                                            <div key={index} className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-black/20">
                                                <div className="flex items-center gap-3 min-w-0">
                                                    {getFileIcon(file.name)}
                                                    <div className="min-w-0">
                                                        <p className="text-xs font-semibold text-slate-705 dark:text-slate-200 truncate">
                                                            {file.name}
                                                        </p>
                                                        <p className="text-[10px] text-slate-400">
                                                            {formatBytes(file.size)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeFile(index)}
                                                    className="text-red-500 hover:text-red-650 p-1.5 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="relative">
                                    <input
                                        type="file"
                                        accept=".pdf,.doc,.docx,.xls,.xlsx,.zip"
                                        multiple
                                        onChange={handleFileChange}
                                        id="quest-files-input"
                                        className="hidden"
                                    />
                                    <label
                                        htmlFor="quest-files-input"
                                        className="flex flex-col items-center justify-center gap-1.5 px-4 py-5 rounded-xl border border-dashed border-slate-300 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500/50 bg-slate-50/50 dark:bg-black/15 text-slate-500 dark:text-slate-400 cursor-pointer text-xs transition-all duration-300"
                                    >
                                        <FileArchive className="w-5 h-5 text-indigo-500 animate-bounce" />
                                        <span className="font-bold text-slate-700 dark:text-slate-350">Seret atau pilih dokumen tugas</span>
                                        <span className="text-[10px] text-slate-400">Format PDF, DOC, DOCX, XLS, XLSX, ZIP</span>
                                    </label>
                                </div>

                                {clientErrors.files && (
                                    <p className="text-xs text-red-500 font-semibold mt-1 flex items-center gap-1">
                                        <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {clientErrors.files}
                                    </p>
                                )}
                                {errors.files && (
                                    <p className="text-xs text-red-500 font-semibold mt-1">{errors.files}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Budget, deadline & Live Estimation widgets (lg:col-span-4) */}
                    <div className="space-y-6 lg:col-span-4">
                        
                        {/* Card 3: Financial settings & Deadline */}
                        <div className="bg-white/70 dark:bg-[#0c122c]/40 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800/80 p-6 shadow-md space-y-4 font-['Oxanium']">
                            <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
                                <DollarSign className="w-5 h-5 text-indigo-500" />
                                <h3 className="text-xs font-black uppercase font-['Orbitron'] text-slate-700 dark:text-blue-200 tracking-wider">
                                    Anggaran & Deadline
                                </h3>
                            </div>

                            {/* Min Budget */}
                            <div className="space-y-1.5">
                                <label className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider font-['Orbitron']">
                                    Gaji Minimal (IDR) <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-3 text-xs font-bold text-slate-400">Rp</span>
                                    <input
                                        type="number"
                                        required
                                        placeholder="Contoh: 500000"
                                        value={data.min_salary}
                                        onChange={(e) => setData("min_salary", e.target.value)}
                                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-xs font-bold text-slate-800 dark:text-white"
                                    />
                                </div>
                                {errors.min_salary && (
                                    <p className="text-xs text-red-500 font-semibold mt-0.5">{errors.min_salary}</p>
                                )}
                            </div>

                            {/* Max Budget */}
                            <div className="space-y-1.5">
                                <label className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider font-['Orbitron']">
                                    Gaji Maksimal (IDR) <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-3 text-xs font-bold text-slate-400">Rp</span>
                                    <input
                                        type="number"
                                        required
                                        placeholder="Contoh: 1500000"
                                        value={data.max_salary}
                                        onChange={(e) => setData("max_salary", e.target.value)}
                                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-xs font-bold text-slate-800 dark:text-white"
                                    />
                                </div>
                                {errors.max_salary && (
                                    <p className="text-xs text-red-500 font-semibold mt-0.5">{errors.max_salary}</p>
                                )}
                            </div>

                            {/* Deadline */}
                            <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800/40">
                                <label className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider font-['Orbitron']">
                                    Tenggat Waktu <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="datetime-local"
                                        required
                                        value={data.deadline}
                                        onChange={(e) => setData("deadline", e.target.value)}
                                        className="w-full px-3 py-2.5 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-xs font-bold text-slate-800 dark:text-white cursor-pointer"
                                    />
                                </div>
                                {errors.deadline && (
                                    <p className="text-xs text-red-500 font-semibold mt-0.5">{errors.deadline}</p>
                                )}
                            </div>
                        </div>

                        {/* Card 4: RPG Rewards Estimator */}
                        <div className="bg-white/70 dark:bg-[#0c122c]/40 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800/80 p-6 shadow-md space-y-4 font-['Orbitron']">
                            <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Award className="w-5 h-5 text-purple-500 animate-pulse" />
                                    <h3 className="text-xs font-black uppercase text-slate-700 dark:text-blue-200 tracking-wider">
                                        Quest Rewards Estimator
                                    </h3>
                                </div>
                                <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-purple-500/10 text-purple-650 dark:text-purple-305 border border-purple-500/20">
                                    Rank: {rewards.rank}
                                </span>
                            </div>

                            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-sans leading-relaxed">
                                <Info className="w-3.5 h-3.5 text-indigo-500 inline mr-1 -mt-0.5" />
                                Hadiah RPG akan otomatis dikalkulasikan berdasarkan anggaran quest Anda dan akan ditambahkan ke akun pekerja saat tugas disetujui.
                            </p>

                            <div className="grid grid-cols-3 gap-2.5 text-center text-xs font-bold font-['Orbitron'] pt-1">
                                <div className="py-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-300 flex flex-col items-center hover:scale-[1.03] transition-transform">
                                    <Award className="w-4 h-4 text-purple-500 mb-1" />
                                    <span className="text-[8px] text-slate-400 font-semibold font-sans">EXP</span>
                                    <span className="text-[11px] font-black">+{rewards.exp}</span>
                                </div>
                                <div className="py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex flex-col items-center hover:scale-[1.03] transition-transform">
                                    <Award className="w-4 h-4 text-amber-500 mb-1" />
                                    <span className="text-[8px] text-slate-400 font-semibold font-sans">GOLD</span>
                                    <span className="text-[11px] font-black">+{rewards.gold}</span>
                                </div>
                                <div className="py-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-305 flex flex-col items-center hover:scale-[1.03] transition-transform">
                                    <Award className="w-4 h-4 text-indigo-500 mb-1" />
                                    <span className="text-[8px] text-slate-400 font-semibold font-sans">ERP</span>
                                    <span className="text-[11px] font-black">+{rewards.erp}</span>
                                </div>
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex gap-3 pt-2">
                            <Link
                                href="/student/quests"
                                className="flex-1 py-3 border border-slate-200 dark:border-slate-800 text-center rounded-xl text-xs font-black uppercase font-['Orbitron'] tracking-wider text-slate-600 dark:text-slate-400 bg-slate-100/50 dark:bg-blue-950/20 hover:bg-slate-200/50 dark:hover:bg-blue-900/10 transition-colors"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex-1 py-3 rounded-xl text-xs font-black uppercase font-['Orbitron'] tracking-wider text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-[0_0_15px_rgba(99,102,241,0.4)] disabled:opacity-50 transition-all duration-300 transform active:scale-[0.98] cursor-pointer text-center"
                            >
                                {processing ? "Mengirim..." : "Publikasikan"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
