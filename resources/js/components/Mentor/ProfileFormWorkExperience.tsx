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

export default function ProfileFormWorkExperience({
    workExperiences,
    onChange,
    errors,
}: Props) {
    const inputClass =
        'w-full rounded-lg border border-slate-200/90 bg-slate-50/85 px-3 py-2.5 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400/80 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-900/30 dark:text-white dark:placeholder:text-slate-600 dark:focus:border-indigo-500/40';

    const labelClass =
        'mb-1.5 block text-[0.6rem] font-semibold tracking-[0.2em] text-slate-500 dark:text-slate-500 uppercase';

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

    const handleChange = (
        idx: number,
        key: keyof WorkExperience,
        val: string,
    ) => {
        const updated = workExperiences.map((exp, i) => {
            if (i === idx) {
                return { ...exp, [key]: val };
            }
            return exp;
        });
        onChange(updated);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
                <h3 className="flex items-center gap-2 text-base font-semibold text-slate-800 dark:text-white">
                    <Briefcase
                        size={18}
                        className="text-indigo-600 dark:text-indigo-400"
                    />
                    Work Experience History
                </h3>
                <button
                    type="button"
                    onClick={handleAdd}
                    className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 font-['Outfit'] text-xs font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500 dark:bg-indigo-600 dark:hover:bg-indigo-500"
                >
                    <Plus size={14} strokeWidth={2.5} />
                    ADD RECORD
                </button>
            </div>

            {workExperiences.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-100/40 py-10 text-center dark:border-slate-800 dark:bg-slate-900/10">
                    <Briefcase className="mx-auto mb-3 h-8 w-8 text-slate-400 dark:text-slate-600" />
                    <p className="font-['Outfit'] text-sm font-medium text-slate-500 dark:text-slate-400">
                        No work experience records added yet.
                    </p>
                    <p className="mt-1 font-['Outfit'] text-xs text-slate-400 dark:text-slate-600">
                        Click the "Add Record" button to add your work history.
                    </p>
                </div>
            ) : (
                <div className="space-y-6">
                    {workExperiences.map((exp, idx) => (
                        <div
                            key={idx}
                            className="relative rounded-xl border border-slate-200 bg-slate-100/40 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/20"
                        >
                            {/* REMOVE BUTTON */}
                            <button
                                type="button"
                                onClick={() => handleRemove(idx)}
                                className="absolute top-4 right-4 text-slate-400 transition-colors hover:text-red-500"
                                title="Remove Record"
                            >
                                <Trash2 size={16} />
                            </button>

                            <div className="grid grid-cols-1 gap-5 pr-6 sm:grid-cols-2 md:grid-cols-4">
                                {/* JABATAN */}
                                <div className="sm:col-span-2">
                                    <label className={labelClass}>
                                        Job Position / Title *
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Senior Frontend Engineer"
                                        value={exp.jabatan || ''}
                                        onChange={(e) =>
                                            handleChange(
                                                idx,
                                                'jabatan',
                                                e.target.value,
                                            )
                                        }
                                        className={inputClass}
                                        required
                                    />
                                    {errors[
                                        `work_experiences.${idx}.jabatan`
                                    ] && (
                                        <span className="mt-1.5 block text-xs font-medium text-rose-500">
                                            Position is required
                                        </span>
                                    )}
                                </div>

                                {/* PERUSAHAAN */}
                                <div className="sm:col-span-2">
                                    <label className={labelClass}>
                                        Company Name *
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Google DeepMind"
                                        value={exp.perusahaan || ''}
                                        onChange={(e) =>
                                            handleChange(
                                                idx,
                                                'perusahaan',
                                                e.target.value,
                                            )
                                        }
                                        className={inputClass}
                                        required
                                    />
                                    {errors[
                                        `work_experiences.${idx}.perusahaan`
                                    ] && (
                                        <span className="mt-1.5 block text-xs font-medium text-rose-500">
                                            Company is required
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
                                        placeholder="e.g. 2021"
                                        value={exp.tahun_mulai || ''}
                                        onChange={(e) =>
                                            handleChange(
                                                idx,
                                                'tahun_mulai',
                                                e.target.value,
                                            )
                                        }
                                        className={inputClass}
                                        required
                                    />
                                    {errors[
                                        `work_experiences.${idx}.tahun_mulai`
                                    ] && (
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
                                        placeholder="e.g. 2024 or Present"
                                        value={exp.tahun_selesai || ''}
                                        onChange={(e) =>
                                            handleChange(
                                                idx,
                                                'tahun_selesai',
                                                e.target.value,
                                            )
                                        }
                                        className={inputClass}
                                    />
                                </div>

                                {/* DESKRIPSI */}
                                <div className="sm:col-span-2 md:col-span-4">
                                    <label className={labelClass}>
                                        Job Duties & Achievements
                                    </label>
                                    <textarea
                                        rows={2}
                                        placeholder="Briefly describe your key responsibilities and accomplishments..."
                                        value={exp.deskripsi || ''}
                                        onChange={(e) =>
                                            handleChange(
                                                idx,
                                                'deskripsi',
                                                e.target.value,
                                            )
                                        }
                                        className={`${inputClass} resize-none`}
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
