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
            <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-6 py-10 text-center dark:border-[#3B28F6]/20 dark:bg-[#04040a]/40">
                <Briefcase
                    className="mx-auto mb-2 animate-pulse text-slate-400 dark:text-slate-500"
                    size={24}
                />
                <p className="font-['Orbitron'] text-xs tracking-widest text-slate-400 uppercase dark:text-slate-500">
                    No Professional History Logged
                </p>
            </div>
        );
    }

    return (
        <div className="relative ml-3 space-y-6 pl-8 md:pl-12">
            {/* Dynamic yellow line */}
            <div className="absolute top-6 -bottom-4 left-[10px] w-[3px] rounded-full bg-yellow-400 dark:bg-yellow-500" />

            {workExperiences.map((exp, idx) => (
                <div key={idx} className="group relative">
                    {/* Yellow Circle Node with Dark Center (no white) */}
                    <div className="absolute top-1 -left-[30px] z-10 flex h-5 w-5 items-center justify-center rounded-full border-4 border-yellow-400 bg-[#3B28F6] shadow-[0_0_8px_rgba(250,204,21,0.6)] transition-transform duration-300 group-hover:scale-110 md:-left-[46px] dark:bg-[#0B0F2E]" />

                    {/* Content Card */}
                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-colors duration-300 hover:border-indigo-500/50 hover:shadow-md md:p-6 dark:border-[#3B28F6]/20 dark:bg-[#13174D]/50 dark:shadow-none dark:hover:border-[#3B28F6]/50 dark:hover:shadow-[0_4px_20px_rgba(0,0,0,0.35)]">
                        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                            <div>
                                {/* Position/Job Title */}
                                <h4 className="font-['Orbitron'] text-base leading-tight font-bold tracking-wide text-slate-900 dark:text-white">
                                    {exp.jabatan}
                                </h4>
                                {/* Company */}
                                <p className="mt-1 font-['Oxanium'] text-xs font-semibold text-indigo-600 dark:text-[#3b4ffa]">
                                    {exp.perusahaan}
                                </p>
                            </div>

                            {/* Years / Period */}
                            <span className="shrink-0 self-start rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-1 font-['Orbitron'] text-[10px] font-extrabold tracking-wider text-yellow-600 sm:self-auto dark:text-yellow-400">
                                {exp.tahun_mulai} —{' '}
                                {exp.tahun_selesai || 'Present'}
                            </span>
                        </div>

                        {/* Job Description */}
                        {exp.deskripsi && (
                            <p className="mt-3 max-w-4xl text-xs leading-relaxed font-medium text-slate-600 md:text-sm dark:text-white">
                                {exp.deskripsi}
                            </p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
