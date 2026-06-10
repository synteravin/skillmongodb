import React from 'react';
import { Plus, Trash2, GraduationCap } from 'lucide-react';

interface Education {
    gelar: string;
    prodi: string;
    universitas: string;
    tahun_mulai: string;
    tahun_selesai: string;
    spesialisasi: string;
}

interface Props {
    educations: Education[];
    onChange: (educations: Education[]) => void;
    errors: any;
}

export default function ProfileFormEducation({ educations, onChange, errors }: Props) {
    const handleAdd = () => {
        const newEdu: Education = {
            gelar: '',
            prodi: '',
            universitas: '',
            tahun_mulai: '',
            tahun_selesai: '',
            spesialisasi: '',
        };
        onChange([...educations, newEdu]);
    };

    const handleRemove = (idx: number) => {
        const filtered = educations.filter((_, i) => i !== idx);
        onChange(filtered);
    };

    const handleChange = (idx: number, key: keyof Education, val: string) => {
        const updated = educations.map((edu, i) => {
            if (i === idx) {
                return { ...edu, [key]: val };
            }
            return edu;
        });
        onChange(updated);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-slate-800 pb-2">
                <h3 className="flex items-center gap-2 font-['Orbitron'] text-xs font-bold tracking-[2px] text-[#0070b8] dark:text-[#00d4ff] uppercase">
                    <GraduationCap size={16} />
                    Education & Credentials
                </h3>
                <button
                    type="button"
                    onClick={handleAdd}
                    className="flex items-center gap-1 bg-[#3B28F6] hover:bg-indigo-600 px-3 py-1 font-['Orbitron'] text-[10px] font-bold tracking-wider text-white transition-all shadow-[0_0_10px_rgba(59,40,246,0.3)] hover:shadow-[0_0_15px_rgba(59,40,246,0.5)]"
                    style={{
                        clipPath: 'polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)',
                    }}
                >
                    <Plus size={12} strokeWidth={2.5} />
                    ADD RECORD
                </button>
            </div>

            {educations.length === 0 ? (
                <div className="border border-dashed border-[#3B28F6]/20 bg-gray-50/50 py-8 text-center dark:border-slate-800 dark:bg-[#04040a]/40">
                    <p className="font-['Orbitron'] text-xs tracking-widest text-gray-400 dark:text-gray-600 uppercase">
                        No Academic Credentials Uploaded
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {educations.map((edu, idx) => (
                        <div
                            key={idx}
                            className="relative border border-[#3B28F6]/25 bg-white p-4 dark:border-slate-800 dark:bg-[#050619]/90 shadow-sm"
                        >
                            {/* REMOVE BUTTON */}
                            <button
                                type="button"
                                onClick={() => handleRemove(idx)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                                title="Remove Record"
                            >
                                <Trash2 size={16} />
                            </button>

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4 pr-6">
                                {/* GELAR */}
                                <div>
                                    <label className="mb-0.5 block text-[9px] tracking-[1px] font-semibold text-yellow-600 dark:text-yellow-400 uppercase">
                                        Degree / Title *
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. B.S., M.S., or Certificate"
                                        value={edu.gelar || ''}
                                        onChange={(e) => handleChange(idx, 'gelar', e.target.value)}
                                        className="w-full border border-gray-200 bg-gray-50 px-2 py-1.5 font-['Oxanium'] text-xs text-gray-800 outline-none focus:border-[#3B28F6] dark:border-slate-800 dark:bg-[#020205] dark:text-gray-300"
                                    />
                                    {errors[`educations.${idx}.gelar`] && (
                                        <span className="text-[10px] text-rose-500 font-medium">
                                            Required
                                        </span>
                                    )}
                                </div>

                                {/* PRODI */}
                                <div>
                                    <label className="mb-0.5 block text-[9px] tracking-[1px] font-semibold text-yellow-600 dark:text-yellow-400 uppercase">
                                        Major / Course of Study *
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Computer Science"
                                        value={edu.prodi || ''}
                                        onChange={(e) => handleChange(idx, 'prodi', e.target.value)}
                                        className="w-full border border-gray-200 bg-gray-50 px-2 py-1.5 font-['Oxanium'] text-xs text-gray-800 outline-none focus:border-[#3B28F6] dark:border-slate-800 dark:bg-[#020205] dark:text-gray-300"
                                    />
                                    {errors[`educations.${idx}.prodi`] && (
                                        <span className="text-[10px] text-rose-500 font-medium">
                                            Required
                                        </span>
                                    )}
                                </div>

                                {/* UNIVERSITAS */}
                                <div className="sm:col-span-2">
                                    <label className="mb-0.5 block text-[9px] tracking-[1px] font-semibold text-yellow-600 dark:text-yellow-400 uppercase">
                                        University / Institution *
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. State University"
                                        value={edu.universitas || ''}
                                        onChange={(e) => handleChange(idx, 'universitas', e.target.value)}
                                        className="w-full border border-gray-200 bg-gray-50 px-2 py-1.5 font-['Oxanium'] text-xs text-gray-800 outline-none focus:border-[#3B28F6] dark:border-slate-800 dark:bg-[#020205] dark:text-gray-300"
                                    />
                                    {errors[`educations.${idx}.universitas`] && (
                                        <span className="text-[10px] text-rose-500 font-medium">
                                            Required
                                        </span>
                                    )}
                                </div>

                                {/* TAHUN MULAI */}
                                <div>
                                    <label className="mb-0.5 block text-[9px] tracking-[1px] font-semibold text-yellow-600 dark:text-yellow-400 uppercase">
                                        Start Year *
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. 2017"
                                        value={edu.tahun_mulai || ''}
                                        onChange={(e) => handleChange(idx, 'tahun_mulai', e.target.value)}
                                        className="w-full border border-gray-200 bg-gray-50 px-2 py-1.5 font-['Oxanium'] text-xs text-gray-800 outline-none focus:border-[#3B28F6] dark:border-slate-800 dark:bg-[#020205] dark:text-gray-300"
                                    />
                                    {errors[`educations.${idx}.tahun_mulai`] && (
                                        <span className="text-[10px] text-rose-500 font-medium">
                                            Required
                                        </span>
                                    )}
                                </div>

                                {/* TAHUN SELESAI */}
                                <div>
                                    <label className="mb-0.5 block text-[9px] tracking-[1px] font-semibold text-yellow-600 dark:text-yellow-400 uppercase">
                                        End Year
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. 2021 or Present"
                                        value={edu.tahun_selesai || ''}
                                        onChange={(e) => handleChange(idx, 'tahun_selesai', e.target.value)}
                                        className="w-full border border-gray-200 bg-gray-50 px-2 py-1.5 font-['Oxanium'] text-xs text-gray-800 outline-none focus:border-[#3B28F6] dark:border-slate-800 dark:bg-[#020205] dark:text-gray-300"
                                    />
                                </div>

                                {/* SPESIALISASI */}
                                <div className="sm:col-span-2">
                                    <label className="mb-0.5 block text-[9px] tracking-[1px] font-semibold text-yellow-600 dark:text-yellow-400 uppercase">
                                        Specialization / Honors
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Intelligent Systems, Summa Cum Laude"
                                        value={edu.spesialisasi || ''}
                                        onChange={(e) => handleChange(idx, 'spesialisasi', e.target.value)}
                                        className="w-full border border-gray-200 bg-gray-50 px-2 py-1.5 font-['Oxanium'] text-xs text-gray-800 outline-none focus:border-[#3B28F6] dark:border-slate-800 dark:bg-[#020205] dark:text-gray-300"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
