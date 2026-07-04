import React, { useState } from 'react';
import { Mail, Linkedin, Copy, Check, Briefcase, GraduationCap, GitBranch, Rocket } from 'lucide-react';
import MentorTimeline from '@/components/Mentor/MentorTimeline';
import MentorEducationList from '@/components/Mentor/MentorEducationList';

interface CareerGroupItem {
    id: string;
    name: string;
    description: string | null;
    slug: string;
}

interface Props {
    mentor: {
        _id: string;
        name: string;
        username: string;
        email: string;
        avatar: string | null;
        role: string;

        // Profile fields
        profession: string;
        linkedin: string;
        description: string;
        user_experience: string;

        // Lists
        work_experiences: any[];
        educations: any[];

        // Career Branches
        career_groups: CareerGroupItem[];
        stats: {
            total_career_groups: number;
            total_students: number;
        };
    };
}

export default function MentorProfile({ mentor }: Props) {
    const [copied, setCopied] = useState(false);

    const copyEmail = () => {
        navigator.clipboard.writeText(mentor.email);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const formatNumber = (num: number): string => {
        if (num >= 1000) {
            return (num / 1000).toFixed(0) + 'K+';
        }
        return num.toString();
    };

    return (
        <div className="min-h-screen w-full bg-[#f0f2fa] text-gray-900 transition-colors duration-300 dark:bg-[#020208] dark:text-white pb-16 font-sans relative overflow-x-hidden">

            {/* ── HEADER NAVIGATION (MATCHING SELECT COURSE) ── */}
            <div className="w-full shrink-0 px-1 pt-0.5 relative z-30">
                <div
                    className="relative border-[2px] md:border-[3px] border-transparent"
                    style={{
                        borderImage:
                            'linear-gradient(to bottom, #3B28F6 0%, #4c2fff 30%, #7c3aed 50%, #facc15 100%) 1',
                    }}
                >
                    <div className="flex items-center justify-between gap-2 bg-white dark:bg-[#040812] px-3 py-3 md:px-6 md:py-4 relative">
                        <button
                            onClick={() => window.history.back()}
                            className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded border-2 border-blue-500 bg-blue-100 transition-colors hover:border-blue-600 hover:bg-blue-200 dark:border-blue-800 dark:bg-[#0b1021] dark:hover:border-blue-600 dark:hover:bg-blue-900/40 md:h-12 md:w-12 cursor-pointer"
                        >
                            <svg viewBox="0 0 48 48" className="h-7 w-7 scale-125 text-indigo-600 transition-transform duration-200 hover:scale-150 dark:text-indigo-500 md:h-9 md:w-9">
                                <rect x="12" y="20" width="29" height="4" fill="currentColor" />
                                <rect x="8"  y="20" width="4"  height="4" fill="currentColor" />
                                <rect x="5"  y="20" width="5"  height="4" fill="currentColor" />
                                <rect x="8"  y="16" width="4"  height="4" fill="currentColor" />
                                <rect x="8"  y="24" width="4"  height="4" fill="currentColor" />
                                <rect x="12" y="12" width="4"  height="4" fill="currentColor" />
                                <rect x="12" y="28" width="4"  height="4" fill="currentColor" />
                                <rect x="16" y="8"  width="4"  height="4" fill="currentColor" />
                                <rect x="16" y="32" width="4"  height="4" fill="currentColor" />
                            </svg>
                        </button>

                        {/* Title */}
                        <h1 className="flex-1 text-center text-sm min-[390px]:text-base sm:text-xl md:text-2xl lg:text-3xl 2xl:text-4xl font-['Orbitron'] font-bold dark:text-white text-[#1e3a8a] tracking-[0.05em] min-[390px]:tracking-[0.1em] md:tracking-[0.15em] uppercase">
                            Mentor Profile
                        </h1>

                        {/* Spacer to center title on mobile */}
                        <div className="w-10 h-10 shrink-0 md:hidden" />
                    </div>
                </div>
            </div>

            {/* ── CORE CONTENT BODY ── */}
            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 mt-8 relative z-20 space-y-12">

                {/* ================= PROFILE INFO CARD ================= */}
                <div className="bg-white dark:bg-[#13174D]/50 border border-slate-200 dark:border-[#3B28F6]/20 p-6 md:p-8 rounded-2xl shadow-md dark:shadow-[0_4px_30px_rgba(0,0,0,0.3)]">
                    <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-stretch">
                        {/* Profile Image */}
                        <div className="relative shrink-0 w-full h-56 sm:w-52 sm:h-52 md:w-64 md:h-64 lg:w-72 lg:h-72 rounded-2xl overflow-hidden border-2 border-slate-200 dark:border-slate-800 shadow-md">
                            <img
                                src={mentor.avatar || `https://ui-avatars.com/api/?name=${mentor.name}&background=3b28f6&color=fff`}
                                className="absolute inset-0 h-full w-full object-cover"
                                alt={mentor.name}
                            />
                        </div>

                        {/* Profile Details */}
                        <div className="flex-1 space-y-4">
                            <div>
                                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-['Outfit'] tracking-tight text-slate-900 dark:text-white leading-tight">
                                    {mentor.name}
                                </h2>
                                <p className="font-['Outfit'] text-sm md:text-base font-semibold text-indigo-600 dark:text-[#3b4ffa] mt-1">
                                    {mentor.profession || 'Mentor Instructor'}
                                </p>
                            </div>

                           {/* Social / Contact Pills */}
                            <div className="flex flex-wrap gap-3">
                                {/* Email Pill */}
                                <button
                                    onClick={copyEmail}
                                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 hover:bg-slate-100 dark:bg-white/10 dark:hover:bg-white/15 border border-slate-200 dark:border-white/20 text-xs font-['Outfit'] font-bold text-slate-800 dark:text-white transition cursor-pointer"
                                >
                                    <Mail size={14} className="text-indigo-600 dark:text-[#7C8BFF] shrink-0" />
                                    <span className="truncate max-w-[180px] sm:max-w-xs">{mentor.email}</span>
                                    {copied ? (
                                        <Check size={14} className="text-emerald-500 shrink-0 ml-1" />
                                    ) : (
                                        <Copy size={14} className="text-slate-500 dark:text-white/70 shrink-0 ml-1" />
                                    )}
                                </button>

                                {/* LinkedIn Pill */}
                                {mentor.linkedin && (
                                    <a
                                        href={mentor.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 pl-1.5 pr-4 py-1.5 rounded-full bg-slate-50 hover:bg-slate-100 dark:bg-white/10 dark:hover:bg-white/15 border border-slate-200 dark:border-white/20 text-xs font-['Outfit'] font-bold text-slate-800 dark:text-white transition hover:text-indigo-600 dark:hover:text-[#7C8BFF]"
                                    >
                                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#0A66C2] shrink-0">
                                            <Linkedin size={13} className="text-white" fill="white" />
                                        </span>
                                        <span>LinkedIn</span>
                                    </a>
                                )}
                            </div>

                            {/* Description / Bio */}
                            <p className="text-xs sm:text-sm font-['Outfit'] text-slate-600 dark:text-white leading-relaxed max-w-4xl font-medium">
                                {mentor.description || "The instructor hasn't set an operational biography node yet."}
                            </p>

                        {/* Stats Grid */}
                        <div className="flex flex-wrap gap-4 pt-2">
                            {/* Stat 1: Experience */}
                            <div className="flex flex-col justify-center items-center px-6 py-3 rounded-xl border border-slate-200 dark:border-white/20 bg-slate-50 dark:bg-white/10 min-w-[110px] text-center shadow-xs">
                                <span className="font-['Outfit'] text-lg md:text-xl font-bold text-slate-900 dark:text-white">
                                    {mentor.user_experience || '0+'}
                                </span>
                                <span className="text-[10px] md:text-xs text-slate-500 dark:text-white/80 font-['Outfit'] font-bold mt-0.5">
                                    Years Exp.
                                </span>
                            </div>

                            {/* Stat 2: Career Branches */}
                            <div className="flex flex-col justify-center items-center px-6 py-3 rounded-xl border border-slate-200 dark:border-white/20 bg-slate-50 dark:bg-white/10 min-w-[110px] text-center shadow-xs">
                                <span className="font-['Outfit'] text-lg md:text-xl font-bold text-slate-900 dark:text-white">
                                    {mentor.stats.total_career_groups}
                                </span>
                                <span className="text-[10px] md:text-xs text-slate-500 dark:text-white/80 font-['Outfit'] font-bold mt-0.5">
                                    Branches
                                </span>
                            </div>

                            {/* Stat 3: Students */}
                            <div className="flex flex-col justify-center items-center px-6 py-3 rounded-xl border border-slate-200 dark:border-white/20 bg-slate-50 dark:bg-white/10 min-w-[110px] text-center shadow-xs">
                                <span className="font-['Outfit'] text-lg md:text-xl font-bold text-slate-900 dark:text-white">
                                    {formatNumber(mentor.stats.total_students)}
                                </span>
                                <span className="text-[10px] md:text-xs text-slate-500 dark:text-white/80 font-['Outfit'] font-bold mt-0.5">
                                    Students
                                </span>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>

                {/* ================= WORK EXPERIENCE ================= */}
                <div className="space-y-6">
                    <div className="border-l-4 border-yellow-400 pl-3 md:pl-4">
                        <h3 className="font-['Orbitron'] text-xl md:text-2xl font-bold tracking-wide text-slate-900 dark:text-white uppercase">
                            Work Experience
                        </h3>
                    </div>
                    <MentorTimeline workExperiences={mentor.work_experiences} />
                </div>

                {/* ================= EDUCATION ================= */}
                <div className="space-y-6">
                    <div className="border-l-4 border-yellow-400 pl-3 md:pl-4">
                        <h3 className="font-['Orbitron'] text-xl md:text-2xl font-bold tracking-wide text-slate-900 dark:text-white uppercase">
                            Education
                        </h3>
                    </div>
                    <MentorEducationList educations={mentor.educations} />
                </div>

            {/* ================= CAREER BRANCHES ================= */}
            <div className="space-y-6 ">
                <div className="border-l-4 border-yellow-400 pl-3 md:pl-4">
                    <h3 className="font-['Outfit'] text-xl md:text-2xl font-bold text-slate-900  dark:text-white">
                        Career Branches
                    </h3>
                    <p className="mt-1 text-xs font-['Outfit'] text-slate-500 dark:text-indigo-200">
                        Bidang studi yang diampu oleh mentor ini
                    </p>
                </div>

                {mentor.career_groups.length === 0 ? (
                    <div className="border border-dashed border-slate-200 dark:border-indigo-400/40 bg-slate-50/50 dark:bg-[#1B1F5C]/50 py-12 text-center rounded-xl">
                        <GitBranch className="mx-auto mb-3 text-slate-300 dark:text-indigo-300" size={28} />
                        <p className="font-['Outfit'] text-xs font-semibold tracking-wide text-slate-400 dark:text-indigo-200">
                            No Career Branches Assigned Yet
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {mentor.career_groups.map((group) => (
                            <div
                                key={group.id}
                                className="rounded-xl border border-slate-200 dark:border-indigo-400/30 bg-white dark:bg-[#13174D]/50 p-5 transition-colors hover:border-indigo-500/50 dark:hover:border-[#3B28F6]/50 hover:shadow-lg dark:hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)] "
                            >
                                {/* Icon + Title row */}
                                <div className="flex items-start gap-3 mb-3">
                                    <h4 className="font-['Outfit'] text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-snug pt-1">
                                        {group.name}
                                    </h4>
                                </div>

                                {/* Description */}
                                <p className="font-['Outfit'] text-xs sm:text-sm text-slate-500 dark:text-indigo-100 leading-relaxed line-clamp-3">
                                    {group.description && group.description.trim() !== ''
                                        ? group.description
                                        : 'No description available.'}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            </div>
        </div>
    );
}
