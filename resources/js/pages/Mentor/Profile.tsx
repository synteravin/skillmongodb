import React, { useState, useRef } from 'react';
import AppLayout from '@/layouts/app-layout';
import { useForm } from '@inertiajs/react';
import { Camera, Save, Loader2 } from 'lucide-react';
import ProfileFormBasic from '@/components/Mentor/ProfileFormBasic';
import ProfileFormWorkExperience from '@/components/Mentor/ProfileFormWorkExperience';
import ProfileFormEducation from '@/components/Mentor/ProfileFormEducation';

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

export default function Profile({ mentor }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: mentor.name,
        email: mentor.email,
        profession: mentor.profession || '',
        linkedin: mentor.linkedin || '',
        description: mentor.description || '',
        user_experience: mentor.user_experience || '',
        work_experiences: mentor.work_experiences || [],
        educations: mentor.educations || [],
        avatar: null as File | null,
    });

    const [preview, setPreview] = useState<string | null>(mentor.avatar);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setData('avatar', file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/mentor/profile', {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout>
            <div className="w-full mx-auto space-y-8 p-4 sm:p-6 lg:p-8" style={{ fontFamily: "'Outfit', sans-serif" }}>

                {/* Header Section */}
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl md:text-[28px] font-semibold tracking-tight text-slate-800 dark:text-white">
                        My Profile
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400/60 text-sm md:text-[15px]">
                        Manage your professional biography, avatar, and academic credentials.
                    </p>
                </div>

                <form onSubmit={submit} className="grid grid-cols-1 gap-8 lg:grid-cols-3">

                    {/* LEFT COLUMN: Avatar & Stats */}
                    <div className="space-y-6 lg:col-span-1">

                        {/* Avatar Card */}
                        <div className="relative overflow-hidden rounded-xl border border-slate-200 p-6 dark:border-slate-800">
                            <div className="absolute inset-0 bg-white dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]" />
                            <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700" />

                            <div className="relative z-10 flex flex-col items-center">
                                {/* Circle Avatar Uploader */}
                                <div className="relative mb-6 flex-shrink-0 group">
                                    <div
                                        className="h-32 w-32 cursor-pointer overflow-hidden rounded-full border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-500/40 transition-colors relative"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <img
                                            src={preview || `https://ui-avatars.com/api/?name=${mentor.name}&background=3b28f6&color=fff`}
                                            className="h-full w-full object-cover"
                                            alt="avatar"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <Camera size={24} className="text-white" />
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="absolute right-1 bottom-1 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-colors hover:border-indigo-300 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-indigo-500/40 dark:hover:text-indigo-400"
                                    >
                                        <Camera size={14} />
                                    </button>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                </div>

                                {/* Name & Title */}
                                <h2 className="text-lg font-semibold text-slate-800 dark:text-white text-center break-all mb-1">
                                    {mentor.name}
                                </h2>
                                <p className="text-[0.65rem] font-semibold tracking-[0.15em] uppercase text-indigo-600 dark:text-indigo-400 mb-6 text-center">
                                    {mentor.profession || 'Instructor Mentor'}
                                </p>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-2 gap-4 w-full border-t border-slate-200 dark:border-slate-800 pt-6">
                                    <div className="text-center">
                                        <p className="text-2xl font-semibold tracking-tight text-indigo-600 dark:text-indigo-400">
                                            {mentor.stats.total_courses}
                                        </p>
                                        <p className="text-[0.6rem] font-semibold tracking-[0.2em] text-slate-500 dark:text-slate-500 uppercase mt-1">
                                            Courses
                                        </p>
                                    </div>
                                    <div className="text-center border-l border-slate-200 dark:border-slate-800">
                                        <p className="text-2xl font-semibold tracking-tight text-slate-600 dark:text-slate-300">
                                            {mentor.stats.total_students}
                                        </p>
                                        <p className="text-[0.6rem] font-semibold tracking-[0.2em] text-slate-500 dark:text-slate-500 uppercase mt-1">
                                            Students
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Status Card */}
                        <div className="relative overflow-hidden rounded-xl border border-slate-200 p-6 dark:border-slate-800">
                            <div className="absolute inset-0 bg-white dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]" />
                            <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700" />

                            <div className="relative z-10">
                                <span className="text-[0.6rem] font-semibold tracking-[0.2em] text-slate-500 dark:text-slate-500 uppercase block mb-3">
                                    Account Status
                                </span>
                                <div className="flex items-center gap-2.5 text-sm font-medium text-slate-700 dark:text-slate-300">
                                    <span className="h-2 w-2 rounded-full bg-slate-400 dark:bg-slate-500" />
                                    Instructor Node Active
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Edit Forms */}
                    <div className="space-y-6 lg:col-span-2">

                        <div className="relative overflow-hidden rounded-xl border border-slate-200 p-6 sm:p-8 dark:border-slate-800 space-y-8">
                            <div className="absolute inset-0 bg-white dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]" />
                            <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700" />

                            <div className="relative z-10 space-y-8">
                                {/* Basic Details */}
                                <ProfileFormBasic data={data} setData={setData} errors={errors} />

                                <div className="h-px bg-slate-200 dark:bg-slate-800" />

                                {/* Work Experience */}
                                <ProfileFormWorkExperience
                                    workExperiences={data.work_experiences}
                                    onChange={(val) => setData('work_experiences', val)}
                                    errors={errors}
                                />

                                <div className="h-px bg-slate-200 dark:bg-slate-800" />

                                {/* Education */}
                                <ProfileFormEducation
                                    educations={data.educations}
                                    onChange={(val) => setData('educations', val)}
                                    errors={errors}
                                />
                            </div>
                        </div>

                        {/* Submit Row */}
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-8 py-3 text-sm font-medium text-slate-700 transition-colors hover:border-indigo-300 hover:text-indigo-600 disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-indigo-500/40 dark:hover:text-indigo-400"
                            >
                                {processing ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Save className="h-4 w-4" />
                                )}
                                Save Profile Changes
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}