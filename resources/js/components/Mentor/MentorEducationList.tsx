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
            <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-6 py-10 text-center dark:border-[#3B28F6]/20 dark:bg-[#04040a]/40">
                <GraduationCap
                    className="mx-auto mb-2 animate-pulse text-slate-400 dark:text-slate-500"
                    size={24}
                />
                <p className="font-['Orbitron'] text-xs tracking-widest text-slate-400 uppercase dark:text-slate-500">
                    No Academic Credentials Logged
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {educations.map((edu, idx) => (
                <div
                    key={idx}
                    className="relative flex flex-col justify-between overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-colors duration-300 hover:border-indigo-500/50 hover:shadow-lg md:p-6 dark:border-[#3B28F6]/20 dark:bg-[#13174D]/50 dark:shadow-none dark:hover:border-[#3B28F6]/50 dark:hover:shadow-[0_4px_20px_rgba(0,0,0,0.35)]"
                >
                    <div>
                        {/* Title (Degree & Major) */}
                        <h4 className="font-['Orbitron'] text-base leading-tight font-bold text-slate-900 dark:text-white">
                            {edu.prodi} {edu.gelar ? `(${edu.gelar})` : ''}
                        </h4>

                        {/* University Name */}
                        <p className="mt-1.5 font-['Oxanium'] text-sm font-semibold text-indigo-600 dark:text-[#3b4ffa]">
                            {edu.universitas}
                        </p>

                        {/* Years */}
                        <p className="mt-2 font-['Orbitron'] text-[10px] font-extrabold tracking-wider text-slate-500 dark:text-slate-400">
                            {edu.tahun_mulai} — {edu.tahun_selesai || 'Present'}
                        </p>
                    </div>

                    {/* Specialization / Jurusan */}
                    {edu.spesialisasi && (
                        <div className="mt-4 border-t border-slate-200 pt-3 dark:border-slate-800/80">
                            <span className="block text-[8px] font-bold tracking-[1.5px] text-slate-400 uppercase dark:text-slate-500">
                                Specialization
                            </span>
                            <span className="mt-0.5 block font-['Oxanium'] text-xs font-medium text-slate-600 dark:text-slate-300">
                                {edu.spesialisasi}
                            </span>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
