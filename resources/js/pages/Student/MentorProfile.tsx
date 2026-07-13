import React, { useState } from 'react';
import {
    Mail,
    Linkedin,
    Copy,
    Check,
    Briefcase,
    GraduationCap,
    GitBranch,
    Rocket,
} from 'lucide-react';
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
        <div className="relative min-h-screen w-full overflow-x-hidden bg-[#f0f2fa] pb-16 font-sans text-gray-900 transition-colors duration-300 dark:bg-[#020208] dark:text-white">
            {/* ── HEADER NAVIGATION (MATCHING SELECT COURSE) ── */}
            <div className="relative z-30 w-full shrink-0 px-1 pt-0.5">
                <div
                    className="relative rounded-md p-[2px] md:p-[3px]"
                    style={{
                        backgroundImage:
                            'linear-gradient(to bottom, #3B28F6 0%, #4c2fff 30%, #7c3aed 50%, #facc15 100%)',
                    }}
                >
                    <div className="relative flex items-center justify-between gap-2 rounded-[4px] bg-white px-3 py-3 md:px-6 md:py-4 dark:bg-[#040812]">
                        <button
                            onClick={() => window.history.back()}
                            className="relative z-10 flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded border-2 border-blue-500 bg-blue-100 transition-colors hover:border-blue-600 hover:bg-blue-200 md:h-12 md:w-12 dark:border-blue-800 dark:bg-[#0b1021] dark:hover:border-blue-600 dark:hover:bg-blue-900/40"
                        >
                            <svg
                                viewBox="0 0 48 48"
                                className="h-7 w-7 scale-125 text-indigo-600 transition-transform duration-200 hover:scale-150 md:h-9 md:w-9 dark:text-indigo-500"
                            >
                                <rect
                                    x="12"
                                    y="20"
                                    width="29"
                                    height="4"
                                    fill="currentColor"
                                />
                                <rect
                                    x="8"
                                    y="20"
                                    width="4"
                                    height="4"
                                    fill="currentColor"
                                />
                                <rect
                                    x="5"
                                    y="20"
                                    width="5"
                                    height="4"
                                    fill="currentColor"
                                />
                                <rect
                                    x="8"
                                    y="16"
                                    width="4"
                                    height="4"
                                    fill="currentColor"
                                />
                                <rect
                                    x="8"
                                    y="24"
                                    width="4"
                                    height="4"
                                    fill="currentColor"
                                />
                                <rect
                                    x="12"
                                    y="12"
                                    width="4"
                                    height="4"
                                    fill="currentColor"
                                />
                                <rect
                                    x="12"
                                    y="28"
                                    width="4"
                                    height="4"
                                    fill="currentColor"
                                />
                                <rect
                                    x="16"
                                    y="8"
                                    width="4"
                                    height="4"
                                    fill="currentColor"
                                />
                                <rect
                                    x="16"
                                    y="32"
                                    width="4"
                                    height="4"
                                    fill="currentColor"
                                />
                            </svg>
                        </button>

                        {/* Title */}
                        <h1 className="flex-1 text-center font-['Orbitron'] text-sm font-bold tracking-[0.05em] text-[#1e3a8a] uppercase min-[390px]:text-base min-[390px]:tracking-[0.1em] sm:text-xl md:text-2xl md:tracking-[0.15em] lg:text-3xl 2xl:text-4xl dark:text-white">
                            Mentor Profile
                        </h1>

                        {/* Spacer to center title on mobile */}
                        <div className="h-10 w-10 shrink-0 md:hidden" />
                    </div>
                </div>
            </div>

            {/* ── CORE CONTENT BODY ── */}
            <div className="relative z-20 mx-auto mt-8 w-full space-y-12 px-4 sm:px-6 lg:px-8">
                {/* ================= PROFILE INFO CARD ================= */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md md:p-8 dark:border-[#3B28F6]/20 dark:bg-[#13174D]/50 dark:shadow-[0_4px_30px_rgba(0,0,0,0.3)]">
                    <div className="flex flex-col items-stretch gap-6 md:flex-row md:gap-8">
                        {/* Profile Image */}
                        <div className="relative h-56 w-full shrink-0 overflow-hidden rounded-2xl border-2 border-slate-200 shadow-md sm:h-52 sm:w-52 md:h-64 md:w-64 lg:h-72 lg:w-72 dark:border-slate-800">
                            <img
                                src={
                                    mentor.avatar ||
                                    `https://ui-avatars.com/api/?name=${mentor.name}&background=3b28f6&color=fff`
                                }
                                className="absolute inset-0 h-full w-full object-cover"
                                alt={mentor.name}
                            />
                        </div>

                        {/* Profile Details */}
                        <div className="flex-1 space-y-4">
                            <div>
                                <h2 className="font-['Outfit'] text-2xl leading-tight font-extrabold tracking-tight text-slate-900 sm:text-3xl md:text-4xl dark:text-white">
                                    {mentor.name}
                                </h2>
                                <p className="mt-1 font-['Outfit'] text-sm font-semibold text-indigo-600 md:text-base dark:text-[#3b4ffa]">
                                    {mentor.profession || 'Mentor Instructor'}
                                </p>
                            </div>

                            {/* Social / Contact Pills */}
                            <div className="flex flex-wrap gap-3">
                                {/* Email Pill */}
                                <button
                                    onClick={copyEmail}
                                    className="flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 font-['Outfit'] text-xs font-bold text-slate-800 transition hover:bg-slate-100 dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
                                >
                                    <Mail
                                        size={14}
                                        className="shrink-0 text-indigo-600 dark:text-[#7C8BFF]"
                                    />
                                    <span className="max-w-[180px] truncate sm:max-w-xs">
                                        {mentor.email}
                                    </span>
                                    {copied ? (
                                        <Check
                                            size={14}
                                            className="ml-1 shrink-0 text-emerald-500"
                                        />
                                    ) : (
                                        <Copy
                                            size={14}
                                            className="ml-1 shrink-0 text-slate-500 dark:text-white/70"
                                        />
                                    )}
                                </button>

                                {/* LinkedIn Pill */}
                                {mentor.linkedin && (
                                    <a
                                        href={mentor.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 py-1.5 pr-4 pl-1.5 font-['Outfit'] text-xs font-bold text-slate-800 transition hover:bg-slate-100 hover:text-indigo-600 dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/15 dark:hover:text-[#7C8BFF]"
                                    >
                                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#0A66C2]">
                                            <Linkedin
                                                size={13}
                                                className="text-white"
                                                fill="white"
                                            />
                                        </span>
                                        <span>LinkedIn</span>
                                    </a>
                                )}
                            </div>

                            {/* Description / Bio */}
                            <p className="max-w-4xl font-['Outfit'] text-xs leading-relaxed font-medium text-slate-600 sm:text-sm dark:text-white">
                                {mentor.description ||
                                    "The instructor hasn't set an operational biography node yet."}
                            </p>

                            {/* Stats Grid */}
                            <div className="flex flex-wrap gap-4 pt-2">
                                {/* Stat 1: Experience */}
                                <div className="flex min-w-[110px] flex-col items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-6 py-3 text-center shadow-xs dark:border-white/20 dark:bg-white/10">
                                    <span className="font-['Outfit'] text-lg font-bold text-slate-900 md:text-xl dark:text-white">
                                        {mentor.user_experience || '0+'}
                                    </span>
                                    <span className="mt-0.5 font-['Outfit'] text-[10px] font-bold text-slate-500 md:text-xs dark:text-white/80">
                                        Years Exp.
                                    </span>
                                </div>

                                {/* Stat 2: Career Branches */}
                                <div className="flex min-w-[110px] flex-col items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-6 py-3 text-center shadow-xs dark:border-white/20 dark:bg-white/10">
                                    <span className="font-['Outfit'] text-lg font-bold text-slate-900 md:text-xl dark:text-white">
                                        {mentor.stats.total_career_groups}
                                    </span>
                                    <span className="mt-0.5 font-['Outfit'] text-[10px] font-bold text-slate-500 md:text-xs dark:text-white/80">
                                        Branches
                                    </span>
                                </div>

                                {/* Stat 3: Students */}
                                <div className="flex min-w-[110px] flex-col items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-6 py-3 text-center shadow-xs dark:border-white/20 dark:bg-white/10">
                                    <span className="font-['Outfit'] text-lg font-bold text-slate-900 md:text-xl dark:text-white">
                                        {formatNumber(
                                            mentor.stats.total_students,
                                        )}
                                    </span>
                                    <span className="mt-0.5 font-['Outfit'] text-[10px] font-bold text-slate-500 md:text-xs dark:text-white/80">
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
                        <h3 className="font-['Orbitron'] text-xl font-bold tracking-wide text-slate-900 uppercase md:text-2xl dark:text-white">
                            Work Experience
                        </h3>
                    </div>
                    <MentorTimeline workExperiences={mentor.work_experiences} />
                </div>

                {/* ================= EDUCATION ================= */}
                <div className="space-y-6">
                    <div className="border-l-4 border-yellow-400 pl-3 md:pl-4">
                        <h3 className="font-['Orbitron'] text-xl font-bold tracking-wide text-slate-900 uppercase md:text-2xl dark:text-white">
                            Education
                        </h3>
                    </div>
                    <MentorEducationList educations={mentor.educations} />
                </div>

                {/* ================= CAREER BRANCHES ================= */}
                <div className="space-y-6">
                    <div className="border-l-4 border-yellow-400 pl-3 md:pl-4">
                        <h3 className="font-['Outfit'] text-xl font-bold text-slate-900 md:text-2xl dark:text-white">
                            Career Branches
                        </h3>
                        <p className="mt-1 font-['Outfit'] text-xs text-slate-500 dark:text-indigo-200">
                            Bidang studi yang diampu oleh mentor ini
                        </p>
                    </div>

                    {mentor.career_groups.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 py-12 text-center dark:border-indigo-400/40 dark:bg-[#1B1F5C]/50">
                            <GitBranch
                                className="mx-auto mb-3 text-slate-300 dark:text-indigo-300"
                                size={28}
                            />
                            <p className="font-['Outfit'] text-xs font-semibold tracking-wide text-slate-400 dark:text-indigo-200">
                                No Career Branches Assigned Yet
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {mentor.career_groups.map((group) => (
                                <div
                                    key={group.id}
                                    className="rounded-xl border border-slate-200 bg-white p-5 transition-colors hover:border-indigo-500/50 hover:shadow-lg dark:border-indigo-400/30 dark:bg-[#13174D]/50 dark:hover:border-[#3B28F6]/50 dark:hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
                                >
                                    {/* Icon + Title row */}
                                    <div className="mb-3 flex items-start gap-3">
                                        <h4 className="pt-1 font-['Outfit'] text-xs leading-snug font-bold text-slate-900 sm:text-sm dark:text-white">
                                            {group.name}
                                        </h4>
                                    </div>

                                    {/* Description */}
                                    <p className="line-clamp-3 font-['Outfit'] text-xs leading-relaxed text-slate-500 sm:text-sm dark:text-indigo-100">
                                        {group.description &&
                                        group.description.trim() !== ''
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
