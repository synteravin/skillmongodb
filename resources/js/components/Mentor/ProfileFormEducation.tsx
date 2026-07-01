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
    const inputClass =
        'w-full rounded-lg border border-slate-200 bg-slate-50/40 px-3 py-2.5 text-sm text-slate-800 outline-none transition-colors placeholder:text-slate-400 focus:border-indigo-300 dark:border-slate-800 dark:bg-slate-900/30 dark:text-white dark:placeholder:text-slate-600 dark:focus:border-indigo-500/40';

    const labelClass =
        'mb-1.5 block text-[0.6rem] font-semibold tracking-[0.2em] text-slate-500 dark:text-slate-500 uppercase';

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
        <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <h3 className="flex items-center gap-2 text-base font-semibold text-slate-800 dark:text-white">
                    <GraduationCap size={18} className="text-indigo-600 dark:text-indigo-400" />
                    Education & Credentials
                </h3>
                <button
                    type="button"
                    onClick={handleAdd}
                    className="flex items-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 dark:bg-indigo-600 dark:hover:bg-indigo-500 px-3 py-1.5 font-['Outfit'] text-xs font-semibold text-white transition-colors shadow-sm"
                >
                    <Plus size={14} strokeWidth={2.5} />
                    ADD RECORD
                </button>
            </div>

            {educations.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/10 py-10 text-center">
                    <GraduationCap className="mx-auto h-8 w-8 text-slate-400 dark:text-slate-600 mb-3" />
                    <p className="font-['Outfit'] text-sm font-medium text-slate-500 dark:text-slate-400">
                        No education records added yet.
                    </p>
                    <p className="font-['Outfit'] text-xs text-slate-400 dark:text-slate-600 mt-1">
                        Click the "Add Record" button to add your academic credentials.
                    </p>
                </div>
            ) : (
                <div className="space-y-6">
                    {educations.map((edu, idx) => (
                        <div
                            key={idx}
                            className="relative rounded-xl border border-slate-200 bg-slate-50/30 p-5 dark:border-slate-800 dark:bg-slate-900/20 shadow-sm"
                        >
                            {/* REMOVE BUTTON */}
                            <button
                                type="button"
                                onClick={() => handleRemove(idx)}
                                className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors"
                                title="Remove Record"
                            >
                                <Trash2 size={16} />
                            </button>

                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-4 pr-6">
                                {/* GELAR */}
                                <div>
                                    <label className={labelClass}>
                                        Degree / Title *
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. B.S., M.S., or Certificate"
                                        value={edu.gelar || ''}
                                        onChange={(e) => handleChange(idx, 'gelar', e.target.value)}
                                        className={inputClass}
                                        required
                                    />
                                    {errors[`educations.${idx}.gelar`] && (
                                        <span className="mt-1.5 block text-xs font-medium text-rose-500">
                                            Required
                                        </span>
                                    )}
                                </div>

                                {/* PRODI */}
                                <div>
                                    <label className={labelClass}>
                                        Major / Course of Study *
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Computer Science"
                                        value={edu.prodi || ''}
                                        onChange={(e) => handleChange(idx, 'prodi', e.target.value)}
                                        className={inputClass}
                                        required
                                    />
                                    {errors[`educations.${idx}.prodi`] && (
                                        <span className="mt-1.5 block text-xs font-medium text-rose-500">
                                            Required
                                        </span>
                                    )}
                                </div>

                                {/* UNIVERSITAS */}
                                <div className="sm:col-span-2">
                                    <label className={labelClass}>
                                        University / Institution *
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. State University"
                                        value={edu.universitas || ''}
                                        onChange={(e) => handleChange(idx, 'universitas', e.target.value)}
                                        className={inputClass}
                                        required
                                    />
                                    {errors[`educations.${idx}.universitas`] && (
                                        <span className="mt-1.5 block text-xs font-medium text-rose-500">
                                            Required
                                        </span>
                                    )}
                                </div>

                                {/* TAHUN MULAI */}
                                <div>
                                    <label className={labelClass}>
                                        Start Year *
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. 2017"
                                        value={edu.tahun_mulai || ''}
                                        onChange={(e) => handleChange(idx, 'tahun_mulai', e.target.value)}
                                        className={inputClass}
                                        required
                                    />
                                    {errors[`educations.${idx}.tahun_mulai`] && (
                                        <span className="mt-1.5 block text-xs font-medium text-rose-500">
                                            Required
                                        </span>
                                    )}
                                </div>

                                {/* TAHUN SELESAI */}
                                <div>
                                    <label className={labelClass}>
                                        End Year
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. 2021 or Present"
                                        value={edu.tahun_selesai || ''}
                                        onChange={(e) => handleChange(idx, 'tahun_selesai', e.target.value)}
                                        className={inputClass}
                                    />
                                </div>

                                {/* SPESIALISASI */}
                                <div className="sm:col-span-2">
                                    <label className={labelClass}>
                                        Specialization / Honors
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Intelligent Systems, Summa Cum Laude"
                                        value={edu.spesialisasi || ''}
                                        onChange={(e) => handleChange(idx, 'spesialisasi', e.target.value)}
                                        className={inputClass}
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
