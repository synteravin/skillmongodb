import React from 'react';
import { Plus, Trash2, Briefcase } from 'lucide-react';

interface WorkExperience {
    jabatan: string;
    perusahaan: string;
    tahun_mulai: string;
    tahun_selesai: string;
    deskripsi: string;
}

interface Props {
    workExperiences: WorkExperience[];
    onChange: (experiences: WorkExperience[]) => void;
    errors: any;
}

export default function ProfileFormWorkExperience({ workExperiences, onChange, errors }: Props) {
    const handleAdd = () => {
        const newExp: WorkExperience = {
            jabatan: '',
            perusahaan: '',
            tahun_mulai: '',
            tahun_selesai: '',
            deskripsi: '',
        };
        onChange([...workExperiences, newExp]);
    };

    const handleRemove = (idx: number) => {
        const filtered = workExperiences.filter((_, i) => i !== idx);
        onChange(filtered);
    };

    const handleChange = (idx: number, key: keyof WorkExperience, val: string) => {
        const updated = workExperiences.map((exp, i) => {
            if (i === idx) {
                return { ...exp, [key]: val };
            }
            return exp;
        });
        onChange(updated);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-slate-800 pb-2">
                <h3 className="flex items-center gap-2 font-['Orbitron'] text-xs font-bold tracking-[2px] text-[#0070b8] dark:text-[#00d4ff] uppercase">
                    <Briefcase size={16} />
                    Work Experience History
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

            {workExperiences.length === 0 ? (
                <div className="border border-dashed border-[#3B28F6]/20 bg-gray-50/50 py-8 text-center dark:border-slate-800 dark:bg-[#04040a]/40">
                    <p className="font-['Orbitron'] text-xs tracking-widest text-gray-400 dark:text-gray-600 uppercase">
                        No Work Experience Records Uploaded
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {workExperiences.map((exp, idx) => (
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
                                {/* JABATAN */}
                                <div className="sm:col-span-2">
                                    <label className="mb-0.5 block text-[9px] tracking-[1px] font-semibold text-yellow-600 dark:text-yellow-400 uppercase">
                                        Job Position / Title *
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Senior Frontend Engineer"
                                        value={exp.jabatan || ''}
                                        onChange={(e) => handleChange(idx, 'jabatan', e.target.value)}
                                        className="w-full border border-gray-200 bg-gray-50 px-2 py-1.5 font-['Oxanium'] text-xs text-gray-800 outline-none focus:border-[#3B28F6] dark:border-slate-800 dark:bg-[#020205] dark:text-gray-300"
                                    />
                                    {errors[`work_experiences.${idx}.jabatan`] && (
                                        <span className="text-[10px] text-rose-500 font-medium">
                                            Position is required
                                        </span>
                                    )}
                                </div>

                                {/* PERUSAHAAN */}
                                <div className="sm:col-span-2">
                                    <label className="mb-0.5 block text-[9px] tracking-[1px] font-semibold text-yellow-600 dark:text-yellow-400 uppercase">
                                        Company Name *
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Google DeepMind"
                                        value={exp.perusahaan || ''}
                                        onChange={(e) => handleChange(idx, 'perusahaan', e.target.value)}
                                        className="w-full border border-gray-200 bg-gray-50 px-2 py-1.5 font-['Oxanium'] text-xs text-gray-800 outline-none focus:border-[#3B28F6] dark:border-slate-800 dark:bg-[#020205] dark:text-gray-300"
                                    />
                                    {errors[`work_experiences.${idx}.perusahaan`] && (
                                        <span className="text-[10px] text-rose-500 font-medium">
                                            Company is required
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
                                        placeholder="e.g. 2021"
                                        value={exp.tahun_mulai || ''}
                                        onChange={(e) => handleChange(idx, 'tahun_mulai', e.target.value)}
                                        className="w-full border border-gray-200 bg-gray-50 px-2 py-1.5 font-['Oxanium'] text-xs text-gray-800 outline-none focus:border-[#3B28F6] dark:border-slate-800 dark:bg-[#020205] dark:text-gray-300"
                                    />
                                    {errors[`work_experiences.${idx}.tahun_mulai`] && (
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
                                        placeholder="e.g. 2024 or Present"
                                        value={exp.tahun_selesai || ''}
                                        onChange={(e) => handleChange(idx, 'tahun_selesai', e.target.value)}
                                        className="w-full border border-gray-200 bg-gray-50 px-2 py-1.5 font-['Oxanium'] text-xs text-gray-800 outline-none focus:border-[#3B28F6] dark:border-slate-800 dark:bg-[#020205] dark:text-gray-300"
                                    />
                                </div>

                                {/* DESKRIPSI */}
                                <div className="sm:col-span-2 md:col-span-4">
                                    <label className="mb-0.5 block text-[9px] tracking-[1px] font-semibold text-yellow-600 dark:text-yellow-400 uppercase">
                                        Job Duties & Achievements
                                    </label>
                                    <textarea
                                        rows={2}
                                        placeholder="Briefly describe your key responsibilities and accomplishments..."
                                        value={exp.deskripsi || ''}
                                        onChange={(e) => handleChange(idx, 'deskripsi', e.target.value)}
                                        className="w-full border border-gray-200 bg-gray-50 px-2 py-1.5 font-['Oxanium'] text-xs text-gray-800 outline-none focus:border-[#3B28F6] dark:border-slate-800 dark:bg-[#020205] dark:text-gray-300 resize-none"
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
