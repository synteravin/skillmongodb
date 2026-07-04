import React from 'react';

interface Props {
    data: any;
    setData: (key: string, value: any) => void;
    errors: any;
}

export default function ProfileFormBasic({ data, setData, errors }: Props) {
    const inputClass =
        'w-full rounded-lg border border-slate-200/90 bg-slate-50/85 px-3 py-2.5 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400/80 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-900/30 dark:text-white dark:placeholder:text-slate-600 dark:focus:border-indigo-500/40';

    const labelClass =
        'mb-1.5 block text-[0.6rem] font-semibold tracking-[0.2em] text-slate-500 dark:text-slate-500 uppercase';

    return (
        <div className="space-y-6">
            <span className="block text-[0.6rem] font-semibold tracking-[0.2em] text-slate-500 dark:text-slate-500 uppercase">
                Basic Information
            </span>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {/* NAME */}
                <div>
                    <label className={labelClass}>
                        Full Name
                    </label>
                    <input
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        className={inputClass}
                        placeholder="Your full name"
                        required
                    />
                    {errors.name && (
                        <span className="mt-1.5 block text-xs font-medium text-rose-500">
                            {errors.name}
                        </span>
                    )}
                </div>

                {/* EMAIL */}
                <div>
                    <label className={labelClass}>
                        Email Address
                    </label>
                    <input
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        className={inputClass}
                        placeholder="your@email.com"
                        required
                    />
                    {errors.email && (
                        <span className="mt-1.5 block text-xs font-medium text-rose-500">
                            {errors.email}
                        </span>
                    )}
                </div>

                {/* PROFESSION */}
                <div>
                    <label className={labelClass}>
                        Profession / Title
                    </label>
                    <input
                        type="text"
                        placeholder="e.g. Senior Fullstack Engineer"
                        value={data.profession}
                        onChange={(e) => setData('profession', e.target.value)}
                        className={inputClass}
                    />
                    {errors.profession && (
                        <span className="mt-1.5 block text-xs font-medium text-rose-500">
                            {errors.profession}
                        </span>
                    )}
                </div>

                {/* LINKEDIN */}
                <div>
                    <label className={labelClass}>
                        LinkedIn Profile
                    </label>
                    <input
                        type="url"
                        placeholder="https://linkedin.com/in/username"
                        value={data.linkedin}
                        onChange={(e) => setData('linkedin', e.target.value)}
                        className={inputClass}
                    />
                    {errors.linkedin && (
                        <span className="mt-1.5 block text-xs font-medium text-rose-500">
                            {errors.linkedin}
                        </span>
                    )}
                </div>

                {/* USER EXPERIENCE */}
                <div className="sm:col-span-2">
                    <label className={labelClass}>
                        Years of Experience
                    </label>
                    <input
                        type="text"
                        placeholder="e.g. 8+ Years in Web Development & Software Architecture"
                        value={data.user_experience}
                        onChange={(e) => setData('user_experience', e.target.value)}
                        className={inputClass}
                    />
                    {errors.user_experience && (
                        <span className="mt-1.5 block text-xs font-medium text-rose-500">
                            {errors.user_experience}
                        </span>
                    )}
                </div>

                {/* BIOGRAPHY / DESCRIPTION */}
                <div className="sm:col-span-2">
                    <label className={labelClass}>
                        Biography / Description
                    </label>
                    <textarea
                        rows={4}
                        placeholder="Tell students about your skills, passion, and how you can help them..."
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        className={`${inputClass} resize-none`}
                    />
                    {errors.description && (
                        <span className="mt-1.5 block text-xs font-medium text-rose-500">
                            {errors.description}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
