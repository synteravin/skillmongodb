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
            <div className="w-full mx-auto space-y-8 p-4 sm:p-6 lg:p-8">
                
                {/* Header Section */}
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                        My Profile
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400">
                        Manage your professional biography, avatar, and academic credentials.
                    </p>
                </div>

                <form onSubmit={submit} className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    
                    {/* LEFT COLUMN: Avatar & Stats */}
                    <div className="space-y-6 lg:col-span-1">
                        
                        {/* Avatar Card */}
                        <div className="flex flex-col items-center rounded-3xl border border-gray-100 dark:border-slate-800/80 bg-white dark:bg-slate-950 p-6 shadow-lg shadow-slate-200/5 dark:shadow-none">
                            
                            {/* Circle Avatar Uploader */}
                            <div className="relative mb-6 flex-shrink-0 group">
                                <div
                                    className="h-32 w-32 cursor-pointer overflow-hidden rounded-full border-4 border-indigo-500/20 hover:border-indigo-500 transition-all duration-300 shadow-md relative"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <img
                                        src={preview || `https://ui-avatars.com/api/?name=${mentor.name}&background=3b28f6&color=fff`}
                                        className="h-full w-full object-cover"
                                        alt="avatar"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <Camera size={24} className="text-white animate-pulse" />
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute right-1 bottom-1 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-650 text-white shadow-lg hover:scale-105 active:scale-95 transition-transform border-2 border-white dark:border-slate-950"
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
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white text-center break-all mb-1">
                                {mentor.name}
                            </h2>
                            <p className="text-xs font-semibold tracking-wider uppercase text-indigo-600 dark:text-indigo-400 mb-6 text-center">
                                {mentor.profession || 'Instructor Mentor'}
                            </p>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 gap-4 w-full border-t border-slate-100 dark:border-slate-900 pt-6">
                                <div className="text-center">
                                    <p className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">
                                        {mentor.stats.total_courses}
                                    </p>
                                    <p className="text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase mt-1">
                                        Courses
                                    </p>
                                </div>
                                <div className="text-center border-l border-slate-100 dark:border-slate-900">
                                    <p className="text-2xl font-extrabold text-cyan-500 dark:text-cyan-400">
                                        {mentor.stats.total_students}
                                    </p>
                                    <p className="text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase mt-1">
                                        Students
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Status Card */}
                        <div className="rounded-3xl border border-gray-100 dark:border-slate-800/80 bg-white dark:bg-slate-950 p-6 shadow-lg shadow-slate-200/5 dark:shadow-none">
                            <span className="text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase block mb-3">
                                Account Status
                            </span>
                            <div className="flex items-center gap-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300">
                                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
                                Instructor Node Active
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Edit Forms */}
                    <div className="space-y-6 lg:col-span-2">
                        
                        <div className="rounded-3xl border border-gray-100 dark:border-slate-800/80 bg-white dark:bg-slate-950 p-6 sm:p-8 shadow-lg shadow-slate-200/5 dark:shadow-none space-y-8">
                            
                            {/* Basic Details */}
                            <ProfileFormBasic data={data} setData={setData} errors={errors} />

                            <div className="h-px bg-slate-100 dark:bg-slate-900" />

                            {/* Work Experience */}
                            <ProfileFormWorkExperience
                                workExperiences={data.work_experiences}
                                onChange={(val) => setData('work_experiences', val)}
                                errors={errors}
                            />

                            <div className="h-px bg-slate-100 dark:bg-slate-900" />

                            {/* Education */}
                            <ProfileFormEducation
                                educations={data.educations}
                                onChange={(val) => setData('educations', val)}
                                errors={errors}
                            />
                        </div>

                        {/* Submit Row */}
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex items-center gap-2 rounded-2xl bg-indigo-650 hover:bg-indigo-700 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/10 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
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
