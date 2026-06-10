import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { ArrowLeft, Mail, Linkedin, Copy, Check, Briefcase, GraduationCap, Award } from 'lucide-react';
import MentorTimeline from '@/components/Mentor/MentorTimeline';
import MentorEducationList from '@/components/Mentor/MentorEducationList';

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
        
        // Stats
        assigned_courses: any[];
        stats: {
            total_courses: number;
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

    return (
        <div className="min-h-screen w-full bg-[#f0f2fa] text-gray-900 transition-colors duration-300 dark:bg-[#020205] dark:text-white pb-16 font-sans relative overflow-x-hidden">
            {/* GLOW DECORATIVE BLURS */}
            <div className="pointer-events-none absolute -top-40 left-1/4 h-[350px] w-[500px] rounded-full bg-blue-600/10 blur-[150px] dark:bg-blue-600/5" />
            <div className="pointer-events-none absolute bottom-10 right-1/4 h-[400px] w-[600px] rounded-full bg-indigo-650/10 blur-[180px] dark:bg-[#3B28F6]/5" />

            {/* ── HEADER NAVIGATION (DIAM) ── */}
            <div className="flex-shrink-0 w-full pt-1 px-1 relative z-25">
                <div
                    className="relative border-[2px]"
                    style={{
                        borderImage: "linear-gradient(to bottom, #3B28F6 0%, #4c2fff 30%, #7c3aed 50%, #facc15 100%) 1",
                    }}
                >
                    <div className="py-4 px-4 md:px-8 flex items-center justify-between bg-white dark:bg-[#040812]">
                        <button
                            onClick={() => window.history.back()}
                            className="border-2 border-blue-800 rounded bg-gray-200 dark:bg-[#0b1021] flex items-center justify-center p-2 hover:bg-blue-900/40 hover:border-blue-600 transition-colors w-10 h-10 md:w-12 md:h-12 shrink-0 cursor-pointer"
                        >
                            <ArrowLeft className="h-5 w-5 text-indigo-600 dark:text-indigo-500" />
                        </button>

                        <h1 className="absolute left-0 right-0 text-center text-lg md:text-xl lg:text-2xl font-['Orbitron'] font-bold text-gray-900 dark:text-white tracking-[0.1em] drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] uppercase pointer-events-none">
                            Mentor Profile
                        </h1>

                        <div className="w-10 h-10 md:w-12 md:h-12 opacity-0" />
                    </div>
                </div>
            </div>

            {/* ── CORE PANEL BODY ── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 relative z-20">
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    
                    {/* ================= LEFT PROFILE BOX (BASIC INFO & COURSES) ================= */}
                    <div className="w-full lg:w-[350px] shrink-0 space-y-6">
                        
                        {/* Core Profile Card */}
                        <div className="relative border-2 border-[#3B28F6] bg-white dark:bg-[#050619] p-6 shadow-lg overflow-hidden">
                            <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-transparent via-[#3B28F6] to-transparent" />
                            
                            {/* Avatar (Polygonal) */}
                            <div className="flex justify-center mb-4">
                                <div className="relative" style={{ width: '130px', height: '148px' }}>
                                    <div
                                        className="h-full w-full overflow-hidden border-2 border-transparent shadow-[0_0_20px_rgba(59,40,246,0.3)]"
                                        style={{
                                            clipPath: 'polygon(0% 25%, 50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%)',
                                        }}
                                    >
                                        <img
                                            src={mentor.avatar || `https://ui-avatars.com/api/?name=${mentor.name}&background=3b28f6&color=fff`}
                                            className="h-full w-full object-cover"
                                            alt={mentor.name}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Name & Codename */}
                            <div className="text-center space-y-1.5">
                                <h2 className="font-['Orbitron'] text-base md:text-lg leading-tight font-black tracking-wide text-gray-900 dark:text-white">
                                    {mentor.name}
                                </h2>
                                <p className="font-['Oxanium'] text-xs font-bold text-[#3B28F6] dark:text-[#00d4ff] uppercase tracking-wider">
                                    {mentor.profession || 'MENTOR INSTRUCTOR'}
                                </p>
                            </div>

                            <div className="h-px bg-gray-150 dark:bg-slate-800/80 my-5" />

                            {/* Impact Stats Grid */}
                            <div className="grid grid-cols-2 gap-4 text-center">
                                <div className="border border-[#3B28F6]/20 bg-[#3B28F6]/[0.02] p-3 rounded dark:border-slate-850 dark:bg-[#02020a]/40">
                                    <span className="block font-['Orbitron'] text-xl font-black text-yellow-500">
                                        {mentor.stats.total_courses}
                                    </span>
                                    <span className="block text-[8px] font-extrabold tracking-[1.5px] text-gray-400 dark:text-gray-500 uppercase mt-0.5">
                                        Courses
                                    </span>
                                </div>
                                <div className="border border-[#3B28F6]/20 bg-[#3B28F6]/[0.02] p-3 rounded dark:border-slate-850 dark:bg-[#02020a]/40">
                                    <span className="block font-['Orbitron'] text-xl font-black text-indigo-500 dark:text-[#00d4ff]">
                                        {mentor.stats.total_students}
                                    </span>
                                    <span className="block text-[8px] font-extrabold tracking-[1.5px] text-gray-400 dark:text-gray-500 uppercase mt-0.5">
                                        Students
                                    </span>
                                </div>
                            </div>

                            {/* Mentor Experience Years */}
                            {mentor.user_experience && (
                                <div className="mt-5 border border-yellow-500/20 bg-yellow-500/[0.02] p-3 rounded text-center">
                                    <span className="block text-[8px] font-extrabold tracking-[1.5px] text-yellow-600 dark:text-yellow-400 uppercase">
                                        Total Mentoring Experience
                                    </span>
                                    <span className="block font-['Oxanium'] text-xs font-semibold text-gray-600 dark:text-slate-350 mt-1">
                                        {mentor.user_experience}
                                    </span>
                                </div>
                            )}

                            <div className="h-px bg-gray-150 dark:bg-slate-800/80 my-5" />

                            {/* Social Buttons */}
                            <div className="flex flex-col gap-2">
                                {/* Email copyable button */}
                                <button
                                    onClick={copyEmail}
                                    className="flex items-center justify-between border border-[#3B28F6]/30 bg-gray-50 hover:bg-[#3B28F6]/5 px-4 py-2 font-['Oxanium'] text-xs font-bold text-gray-700 dark:border-slate-800 dark:bg-slate-900/50 dark:text-gray-300 dark:hover:bg-[#3B28F6]/10 w-full transition-colors cursor-pointer"
                                >
                                    <span className="flex items-center gap-2 truncate">
                                        <Mail size={14} className="text-[#3B28F6] shrink-0" />
                                        <span className="truncate">{mentor.email}</span>
                                    </span>
                                    {copied ? (
                                        <Check size={14} className="text-emerald-500 shrink-0" />
                                    ) : (
                                        <Copy size={14} className="text-gray-400 shrink-0" />
                                    )}
                                </button>

                                {/* LinkedIn URL Button */}
                                {mentor.linkedin && (
                                    <a
                                        href={mentor.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-2 bg-[#0077b5] hover:bg-[#006297] text-white px-4 py-2 font-['Orbitron'] text-[10px] font-black tracking-widest uppercase transition-colors"
                                    >
                                        <Linkedin size={14} />
                                        LinkedIn Uplink
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* ASSIGNED COURSES */}
                        <div className="border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#050619]/60 p-5 shadow-sm space-y-4">
                            <h3 className="flex items-center gap-2 font-['Orbitron'] text-xs font-bold tracking-[2px] text-[#0070b8] dark:text-[#00d4ff] uppercase">
                                <Award size={16} />
                                Managed Courses
                            </h3>
                            {mentor.assigned_courses.length === 0 ? (
                                <p className="text-xs font-medium text-gray-400 dark:text-gray-600 italic">
                                    No managed courses under guidance.
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    {mentor.assigned_courses.map((course) => (
                                        <Link
                                            key={course.id}
                                            href={`/student/courses/${course.slug}`}
                                            className="flex items-center gap-3 border border-slate-100 hover:border-[#3B28F6]/30 bg-slate-50/50 hover:bg-[#3B28F6]/5 p-2 rounded transition-all dark:border-slate-900 dark:bg-slate-950/40 dark:hover:border-slate-800"
                                        >
                                            {course.thumbnail_url ? (
                                                <img
                                                    src={course.thumbnail_url}
                                                    alt={course.title}
                                                    className="w-12 h-12 rounded object-cover border border-slate-200 dark:border-slate-800"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 rounded bg-[#3B28F6]/10 flex items-center justify-center shrink-0 border border-[#3B28F6]/20">
                                                    <BookOpen size={16} className="text-[#3B28F6]" />
                                                </div>
                                            )}
                                            <span className="font-['Oxanium'] text-xs font-bold text-gray-800 dark:text-slate-350 line-clamp-2">
                                                {course.title}
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ================= RIGHT WORK & EDUCATION TIMELINE ================= */}
                    <div className="flex-grow w-full space-y-6">
                        
                        {/* Bio / Description */}
                        <div className="border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#050619]/60 p-5 md:p-6 shadow-sm">
                            <h3 className="font-['Orbitron'] text-xs font-bold tracking-[2px] text-[#0070b8] dark:text-[#00d4ff] uppercase mb-3">
                                Operations Biography
                            </h3>
                            <p className="text-sm font-medium leading-relaxed text-gray-650 dark:text-slate-350">
                                {mentor.description || "The instructor hasn't set an operational biography node yet."}
                            </p>
                        </div>

                        {/* Work Experience Timeline */}
                        <div className="border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#050619]/60 p-5 md:p-6 shadow-sm space-y-6">
                            <h3 className="flex items-center gap-2 font-['Orbitron'] text-xs font-bold tracking-[2px] text-[#0070b8] dark:text-[#00d4ff] uppercase border-b border-gray-150 dark:border-slate-800/80 pb-3">
                                <Briefcase size={18} />
                                Professional Timeline (Work Experience)
                            </h3>
                            <MentorTimeline workExperiences={mentor.work_experiences} />
                        </div>

                        {/* Education Milestone List */}
                        <div className="border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#050619]/60 p-5 md:p-6 shadow-sm space-y-6">
                            <h3 className="flex items-center gap-2 font-['Orbitron'] text-xs font-bold tracking-[2px] text-[#0070b8] dark:text-[#00d4ff] uppercase border-b border-gray-150 dark:border-slate-800/80 pb-3">
                                <GraduationCap size={18} />
                                Academic Milestones (Education)
                            </h3>
                            <MentorEducationList educations={mentor.educations} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
