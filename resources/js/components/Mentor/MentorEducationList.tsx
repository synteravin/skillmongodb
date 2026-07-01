import React from 'react';
import { GraduationCap } from 'lucide-react';

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
}

export default function MentorEducationList({ educations }: Props) {
    if (!educations || educations.length === 0) {
        return (
            <div className="border-2 border-dashed border-slate-200 dark:border-[#3B28F6]/20 bg-slate-50/50 dark:bg-[#04040a]/40 py-10 text-center rounded-xl p-6">
                <GraduationCap className="mx-auto mb-2 text-slate-400 dark:text-gray-650 animate-pulse" size={24} />
                <p className="font-['Orbitron'] text-xs tracking-widest text-slate-450 dark:text-gray-500 uppercase">
                    No Academic Credentials Logged
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {educations.map((edu, idx) => (
                <div
                    key={idx}
                    className="relative overflow-hidden bg-white dark:bg-[#13174D]/50 border border-slate-200 dark:border-[#3B28F6]/20 p-5 md:p-6 rounded-xl transition-all duration-300 hover:border-indigo-500/50 dark:hover:border-[#3B28F6]/50 hover:shadow-lg dark:hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)] flex flex-col justify-between"
                >
                    <div>
                        {/* University Icon Container */}
                        <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/30 text-indigo-600 dark:text-[#3b4ffa] mb-4">
                            <GraduationCap size={24} />
                        </div>

                        {/* Title (Degree & Major) */}
                        <h4 className="font-['Orbitron'] text-base font-bold text-slate-900 dark:text-white leading-tight">
                            {edu.prodi} {edu.gelar ? `(${edu.gelar})` : ''}
                        </h4>

                        {/* University Name */}
                        <p className="font-['Oxanium'] text-sm font-semibold text-indigo-600 dark:text-[#3b4ffa] mt-1.5">
                            {edu.universitas}
                        </p>

                        {/* Years */}
                        <p className="font-['Orbitron'] text-[10px] tracking-wider font-extrabold text-slate-500 dark:text-slate-400 mt-2">
                            {edu.tahun_mulai} — {edu.tahun_selesai || 'Present'}
                        </p>
                    </div>

                    {/* Specialization / Jurusan */}
                    {edu.spesialisasi && (
                        <div className="mt-4 border-t border-slate-150 dark:border-slate-800/80 pt-3">
                            <span className="block text-[8px] font-bold tracking-[1.5px] text-slate-400 dark:text-slate-500 uppercase">
                                Specialization
                            </span>
                            <span className="font-['Oxanium'] text-xs font-medium text-slate-650 dark:text-slate-350 mt-0.5 block">
                                {edu.spesialisasi}
                            </span>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
