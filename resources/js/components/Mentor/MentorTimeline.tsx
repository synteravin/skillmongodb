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
            <div className="border border-dashed border-[#3B28F6]/20 bg-gray-50/50 py-10 text-center dark:border-slate-800 dark:bg-[#04040a]/40 p-6">
                <Briefcase className="mx-auto mb-2 text-gray-400 dark:text-gray-650 animate-pulse" size={24} />
                <p className="font-['Orbitron'] text-xs tracking-widest text-gray-450 dark:text-gray-500 uppercase">
                    No Professional History Logged
                </p>
            </div>
        );
    }

    return (
        <div className="relative border-l-2 border-[#3B28F6]/30 dark:border-[#3B28F6]/40 pl-6 ml-3 space-y-6">
            {workExperiences.map((exp, idx) => (
                <div key={idx} className="relative group">
                    {/* Node Pointer Icon */}
                    <div className="absolute -left-[33px] top-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full border-2 border-[#3B28F6] bg-white dark:bg-[#050619] shadow-[0_0_8px_rgba(59,40,246,0.6)] group-hover:scale-125 transition-transform duration-300">
                        <div className="h-1.5 w-1.5 rounded-full bg-yellow-500 animate-ping"></div>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-1">
                        <div>
                            {/* Position */}
                            <h4 className="font-['Orbitron'] text-sm font-bold tracking-wide text-gray-900 dark:text-white leading-tight">
                                {exp.jabatan}
                            </h4>
                            {/* Company */}
                            <p className="font-['Oxanium'] text-xs font-semibold text-[#3B28F6] dark:text-[#00d4ff] mt-0.5">
                                {exp.perusahaan}
                            </p>
                        </div>
                        {/* Period */}
                        <span className="font-['Orbitron'] text-[10px] tracking-wider font-extrabold text-yellow-600 dark:text-yellow-400 bg-yellow-500/5 px-2 py-0.5 border border-yellow-500/10 shrink-0 self-start md:self-auto">
                            {exp.tahun_mulai} — {exp.tahun_selesai || 'Present'}
                        </span>
                    </div>

                    {/* Job Description */}
                    {exp.deskripsi && (
                        <p className="mt-2 text-xs font-medium leading-relaxed text-gray-500 dark:text-gray-400 max-w-3xl">
                            {exp.deskripsi}
                        </p>
                    )}
                </div>
            ))}
        </div>
    );
}
