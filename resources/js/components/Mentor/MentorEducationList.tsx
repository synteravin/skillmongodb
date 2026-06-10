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
            <div className="border border-dashed border-[#3B28F6]/20 bg-gray-50/50 py-10 text-center dark:border-slate-800 dark:bg-[#04040a]/40 p-6">
                <GraduationCap className="mx-auto mb-2 text-gray-400 dark:text-gray-650 animate-pulse" size={24} />
                <p className="font-['Orbitron'] text-xs tracking-widest text-gray-450 dark:text-gray-500 uppercase">
                    No Academic Credentials Logged
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {educations.map((edu, idx) => (
                <div
                    key={idx}
                    className="relative overflow-hidden border border-[#3B28F6]/20 bg-[#3B28F6]/[0.02] p-4 dark:border-slate-800 dark:bg-[#050619]/50 transition-all hover:border-[#3B28F6]/40 hover:shadow-[0_0_15px_rgba(59,40,246,0.1)]"
                >
                    {/* Left glowing strip */}
                    <div className="absolute top-0 bottom-0 left-0 w-1 bg-[#3B28F6]" />

                    <div className="pl-2">
                        <div className="flex items-start justify-between gap-2">
                            <div>
                                {/* Major / Degree */}
                                <h4 className="font-['Orbitron'] text-sm font-bold text-gray-900 dark:text-white leading-tight">
                                    {edu.prodi} ({edu.gelar})
                                </h4>
                                {/* University */}
                                <p className="font-['Oxanium'] text-xs font-semibold text-gray-600 dark:text-gray-400 mt-1">
                                    {edu.universitas}
                                </p>
                            </div>
                            
                            {/* Years */}
                            <span className="font-['Orbitron'] text-[9px] tracking-wider font-extrabold text-yellow-600 dark:text-yellow-400 bg-yellow-500/5 px-2 py-0.5 border border-yellow-500/10 shrink-0">
                                {edu.tahun_mulai} — {edu.tahun_selesai || 'Present'}
                            </span>
                        </div>

                        {/* Specializations/Honors */}
                        {edu.spesialisasi && (
                            <div className="mt-3 border-t border-gray-150 dark:border-slate-800/80 pt-2">
                                <span className="block text-[8px] font-bold tracking-[1.5px] text-gray-400 dark:text-gray-500 uppercase">
                                    Specialization / Honors
                                </span>
                                <span className="font-['Oxanium'] text-xs font-medium text-gray-500 dark:text-slate-400 mt-0.5 block">
                                    {edu.spesialisasi}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
