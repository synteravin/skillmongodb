import React from 'react';
import { Briefcase } from 'lucide-react';

interface WorkExperience {
    jabatan: string;
    perusahaan: string;
    tahun_mulai: string;
    tahun_selesai: string;
    deskripsi: string;
}

interface Props {
    workExperiences: WorkExperience[];
}

export default function MentorTimeline({ workExperiences }: Props) {
    if (!workExperiences || workExperiences.length === 0) {
        return (
            <div className="border-2 border-dashed border-slate-200 dark:border-[#3B28F6]/20 bg-slate-50/50 dark:bg-[#04040a]/40 py-10 text-center rounded-xl p-6">
                <Briefcase className="mx-auto mb-2 text-slate-400 dark:text-slate-500 animate-pulse" size={24} />
                <p className="font-['Orbitron'] text-xs tracking-widest text-slate-400 dark:text-slate-500 uppercase">
                    No Professional History Logged
                </p>
            </div>
        );
    }

    return (
        <div className="relative ml-3 pl-8 md:pl-12 space-y-6">
            {/* Dynamic yellow line */}
            <div className="absolute left-[10px] top-6 -bottom-4 w-[3px] bg-yellow-400 dark:bg-yellow-500 rounded-full" />

            {workExperiences.map((exp, idx) => (
                <div key={idx} className="relative group">
                    {/* Yellow Circle Node with Dark Center (no white) */}
                    <div className="absolute -left-[30px] md:-left-[46px] top-1 flex h-5 w-5 items-center justify-center rounded-full border-4 border-yellow-400 bg-[#3B28F6] dark:bg-[#0B0F2E] shadow-[0_0_8px_rgba(250,204,21,0.6)] group-hover:scale-110 transition-transform duration-300 z-10" />

                    {/* Content Card */}
                    <div className="bg-white dark:bg-[#13174D]/50 border border-slate-200 dark:border-[#3B28F6]/20 rounded-xl p-5 md:p-6 transition-colors duration-300 hover:border-indigo-500/50 dark:hover:border-[#3B28F6]/50 shadow-sm hover:shadow-md dark:shadow-none dark:hover:shadow-[0_4px_20px_rgba(0,0,0,0.35)]">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                                {/* Position/Job Title */}
                                <h4 className="font-['Orbitron'] text-base font-bold tracking-wide text-slate-900 dark:text-white leading-tight">
                                    {exp.jabatan}
                                </h4>
                                {/* Company */}
                                <p className="font-['Oxanium'] text-xs font-semibold text-indigo-600 dark:text-[#3b4ffa] mt-1">
                                    {exp.perusahaan}
                                </p>
                            </div>

                            {/* Years / Period */}
                            <span className="font-['Orbitron'] text-[10px] tracking-wider font-extrabold text-yellow-600 dark:text-yellow-400 bg-yellow-500/10 px-3 py-1 border border-yellow-500/20 rounded-full shrink-0 self-start sm:self-auto">
                                {exp.tahun_mulai} — {exp.tahun_selesai || 'Present'}
                            </span>
                        </div>

                        {/* Job Description */}
                        {exp.deskripsi && (
                            <p className="mt-3 text-xs md:text-sm font-medium leading-relaxed text-slate-600 dark:text-white max-w-4xl">
                                {exp.deskripsi}
                            </p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}