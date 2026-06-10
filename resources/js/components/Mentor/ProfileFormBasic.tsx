import React from 'react';

interface Props {
    data: any;
    setData: (key: string, value: any) => void;
    errors: any;
}

export default function ProfileFormBasic({ data, setData, errors }: Props) {
    return (
        <div className="space-y-4">
            <h3 className="font-['Orbitron'] text-xs font-bold tracking-[2px] text-[#0070b8] dark:text-[#00d4ff] uppercase">
                Basic Operations Data
            </h3>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* NAME */}
                <div>
                    <label className="mb-1 block text-[10px] tracking-[1.5px] font-semibold text-yellow-600 dark:text-yellow-400 uppercase">
                        Codename / Full Name
                    </label>
                    <input
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        className="w-full border border-[#3B28F6]/30 bg-gray-50 px-3 py-2 font-['Oxanium'] text-sm tracking-wide text-gray-800 transition-all outline-none focus:border-[#3B28F6] focus:shadow-[0_0_8px_rgba(59,40,246,0.2)] dark:border-[#1e2a6e] dark:bg-[#050510] dark:text-gray-300"
                        required
                    />
                    {errors.name && (
                        <span className="mt-1 text-xs text-rose-500 font-medium">
                            {errors.name}
                        </span>
                    )}
                </div>

                {/* EMAIL */}
                <div>
                    <label className="mb-1 block text-[10px] tracking-[1.5px] font-semibold text-yellow-600 dark:text-yellow-400 uppercase">
                        Email Uplink
                    </label>
                    <input
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        className="w-full border border-[#3B28F6]/30 bg-gray-50 px-3 py-2 font-['Oxanium'] text-sm tracking-wide text-gray-800 transition-all outline-none focus:border-[#3B28F6] focus:shadow-[0_0_8px_rgba(59,40,246,0.2)] dark:border-[#1e2a6e] dark:bg-[#050510] dark:text-gray-300"
                        required
                    />
                    {errors.email && (
                        <span className="mt-1 text-xs text-rose-500 font-medium">
                            {errors.email}
                        </span>
                    )}
                </div>

                {/* PROFESSION */}
                <div>
                    <label className="mb-1 block text-[10px] tracking-[1.5px] font-semibold text-yellow-600 dark:text-yellow-400 uppercase">
                        Specialization Title (Profession)
                    </label>
                    <input
                        type="text"
                        placeholder="e.g. Senior Fullstack Engineer"
                        value={data.profession}
                        onChange={(e) => setData('profession', e.target.value)}
                        className="w-full border border-[#3B28F6]/30 bg-gray-50 px-3 py-2 font-['Oxanium'] text-sm tracking-wide text-gray-800 transition-all outline-none focus:border-[#3B28F6] focus:shadow-[0_0_8px_rgba(59,40,246,0.2)] dark:border-[#1e2a6e] dark:bg-[#050510] dark:text-gray-300"
                    />
                    {errors.profession && (
                        <span className="mt-1 text-xs text-rose-500 font-medium">
                            {errors.profession}
                        </span>
                    )}
                </div>

                {/* LINKEDIN */}
                <div>
                    <label className="mb-1 block text-[10px] tracking-[1.5px] font-semibold text-yellow-600 dark:text-yellow-400 uppercase">
                        LinkedIn Core Uplink
                    </label>
                    <input
                        type="url"
                        placeholder="https://linkedin.com/in/username"
                        value={data.linkedin}
                        onChange={(e) => setData('linkedin', e.target.value)}
                        className="w-full border border-[#3B28F6]/30 bg-gray-50 px-3 py-2 font-['Oxanium'] text-sm tracking-wide text-gray-800 transition-all outline-none focus:border-[#3B28F6] focus:shadow-[0_0_8px_rgba(59,40,246,0.2)] dark:border-[#1e2a6e] dark:bg-[#050510] dark:text-gray-300"
                    />
                    {errors.linkedin && (
                        <span className="mt-1 text-xs text-rose-500 font-medium">
                            {errors.linkedin}
                        </span>
                    )}
                </div>

                {/* USER EXPERIENCE (YEARS OF EXPERIENCE) */}
                <div className="sm:col-span-2">
                    <label className="mb-1 block text-[10px] tracking-[1.5px] font-semibold text-yellow-600 dark:text-yellow-400 uppercase">
                        Mentorship / Industry Experience
                    </label>
                    <input
                        type="text"
                        placeholder="e.g. 8+ Years in Web Development & Software Architecture"
                        value={data.user_experience}
                        onChange={(e) => setData('user_experience', e.target.value)}
                        className="w-full border border-[#3B28F6]/30 bg-gray-50 px-3 py-2 font-['Oxanium'] text-sm tracking-wide text-gray-800 transition-all outline-none focus:border-[#3B28F6] focus:shadow-[0_0_8px_rgba(59,40,246,0.2)] dark:border-[#1e2a6e] dark:bg-[#050510] dark:text-gray-300"
                    />
                    {errors.user_experience && (
                        <span className="mt-1 text-xs text-rose-500 font-medium">
                            {errors.user_experience}
                        </span>
                    )}
                </div>

                {/* BIOGRAPHY / DESCRIPTION */}
                <div className="sm:col-span-2">
                    <label className="mb-1 block text-[10px] tracking-[1.5px] font-semibold text-yellow-600 dark:text-yellow-400 uppercase">
                        Operator Biography / Core Description
                    </label>
                    <textarea
                        rows={4}
                        placeholder="Tell students about your core skills, passion, and how you can help them..."
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        className="w-full border border-[#3B28F6]/30 bg-gray-50 px-3 py-2 font-['Oxanium'] text-sm tracking-wide text-gray-800 transition-all outline-none focus:border-[#3B28F6] focus:shadow-[0_0_8px_rgba(59,40,246,0.2)] dark:border-[#1e2a6e] dark:bg-[#050510] dark:text-gray-300 resize-none"
                    />
                    {errors.description && (
                        <span className="mt-1 text-xs text-rose-500 font-medium">
                            {errors.description}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
