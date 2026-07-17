import { Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    Camera,
    Loader2,
    Eye,
    EyeOff,
    Check,
    Lock,
    Key,
    User,
    Link2,
    Mail,
    Shield,
} from 'lucide-react';
import React, { useState, useRef } from 'react';
import AvatarCropper from '@/components/AvatarCropper';

type Props = {
    user: {
        name: string;
        username: string;
        email: string;
        linkedin?: string;
        avatar: string;
    };
};

export default function EditProfile({ user }: Props) {
    // ══════════ FORM STATES ══════════
    const profileForm = useForm({
        name: user.name,
        username: user.username,
        email: user.email,
        linkedin: user.linkedin || '',
        avatar: null as File | null,
    });

    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    // ══════════ VISIBILITY STATES ══════════
    const [showCurrentPass, setShowCurrentPass] = useState(false);
    const [showNewPass, setShowNewPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);

    // ══════════ AVATAR STATES & REFS ══════════
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [cropSrc, setCropSrc] = useState<string | null>(null);

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setCropSrc(URL.createObjectURL(e.target.files[0]));
            e.target.value = '';
        }
    };

    const handleCropConfirm = (croppedFile: File) => {
        profileForm.setData('avatar', croppedFile);
        setCropSrc(null);
    };

    const handleCropCancel = () => {
        setCropSrc(null);
    };

    // ══════════ SUBMIT HANDLERS ══════════
    const handleProfileSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        profileForm.post('/student/profile/edit', {
            preserveScroll: true,
        });
    };

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        passwordForm.put('/student/profile/password', {
            preserveScroll: true,
            onSuccess: () => passwordForm.reset(),
        });
    };

    // ══════════ PASSWORD STRENGTH VALIDATION ══════════
    const newPassword = passwordForm.data.password;
    const currentPassword = passwordForm.data.current_password;

    const reqs = {
        length: newPassword.length >= 8,
        lowercase: /[a-z]/.test(newPassword),
        uppercase: /[A-Z]/.test(newPassword),
        notCurrent: newPassword !== '' && newPassword !== currentPassword,
    };

    const score = Object.values(reqs).filter(Boolean).length;
    let strength = 'WEAK';
    let strengthColor = 'text-red-500 bg-red-500/10 border-red-500/30 dark:text-red-400 dark:bg-red-950/20 dark:border-red-900/30';
    let strengthDot = 'bg-red-500 shadow-red-500/50';

    if (score === 3) {
        strength = 'MEDIUM';
        strengthColor = 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30 dark:text-yellow-400 dark:bg-yellow-950/20 dark:border-yellow-900/30';
        strengthDot = 'bg-yellow-500 shadow-yellow-500/50';
    } else if (score === 4) {
        strength = 'STRONG';
        strengthColor = 'text-green-500 bg-green-500/10 border-green-500/30 dark:text-green-400 dark:bg-green-950/20 dark:border-green-900/30';
        strengthDot = 'bg-green-500 shadow-green-500/50';
    }

    return (
        <div className="flex min-h-screen w-full flex-col overflow-y-auto bg-[#f0f2fa] text-gray-900 transition-colors duration-300 dark:bg-[#0c0c14] dark:text-white">
            {/* AvatarCropper Modal */}
            {cropSrc && (
                <AvatarCropper
                    imageSrc={cropSrc}
                    onConfirm={handleCropConfirm}
                    onCancel={handleCropCancel}
                />
            )}

            {/* BG GLOW */}
            <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden">
                <div className="h-[400px] w-[700px] rounded-full bg-blue-600 opacity-5 blur-[160px] dark:opacity-10" />
            </div>

            {/* ── TOOLBAR ── */}
            <div className="relative z-10 flex shrink-0 items-center justify-between px-4 pt-4 pb-2 md:px-8">
                {/* BACK */}
                <Link href="/student/profile">
                    <div
                        className="flex items-center gap-2 border border-[#3B28F6] px-4 py-1.5 font-['Orbitron'] text-[11px] tracking-widest text-[#3B28F6] transition-all hover:border-cyan-500 hover:text-cyan-600 hover:shadow-[0_0_10px_rgba(0,180,220,0.2)] dark:text-blue-400 dark:hover:border-cyan-400 dark:hover:text-cyan-400 dark:hover:shadow-[0_0_10px_rgba(0,212,255,0.35)]"
                        style={{
                            clipPath:
                                'polygon(8px 0%,100% 0%,100% 100%,0% 100%,0% 8px)',
                        }}
                    >
                        <ArrowLeft size={13} strokeWidth={2.5} />
                        BACK
                    </div>
                </Link>

                <h1 className="hidden font-['Orbitron'] text-sm font-bold tracking-[4px] text-gray-700 sm:block dark:text-gray-300">
                    EDIT PROFILE & SECURITY
                </h1>
            </div>

            {/* MAIN CONTENT CONTAINER */}
            <div className="relative z-10 flex flex-1 flex-col gap-6 p-4 md:p-8">
                
                {/* ══════════ KARTU ATAS (EDIT PROFIL) ══════════ */}
                <form
                    onSubmit={handleProfileSubmit}
                    className="flex flex-col gap-6 border-2 border-gray-200 bg-white p-5 shadow-[0_4px_20px_rgba(59,40,246,0.04)] md:p-6 lg:flex-row dark:border-[#3B28F6]/60 dark:bg-[#050619] dark:shadow-none"
                    style={{
                        clipPath: 'polygon(0% 0%, 100% 0%, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0% 100%)',
                    }}
                >
                    {/* SEBELAH KIRI: Foto Profil Upload */}
                    <div className="flex flex-col items-center justify-center border-gray-100 lg:w-1/3 lg:border-r lg:pr-6 dark:border-[#3B28F6]/20">
                        <p className="mb-4 font-['Orbitron'] text-xs font-bold tracking-widest text-[#3B28F6] dark:text-[#00d4ff]">
                            AVATAR MATRIX
                        </p>
                        <div
                            className="relative mb-4 shrink-0"
                            style={{ width: '155px', height: '155px' }}
                        >
                            <div
                                className="h-full w-full cursor-pointer overflow-hidden rounded-full border-4 border-[#3B28F6] transition hover:border-[#FACC15] dark:border-[#3B28F6] dark:hover:border-[#FACC15]"
                                onClick={handleAvatarClick}
                            >
                                <img
                                    src={
                                        profileForm.data.avatar
                                            ? URL.createObjectURL(profileForm.data.avatar)
                                            : (user.avatar ?? '/images/default-avatar.svg')
                                    }
                                    className="h-full w-full object-cover"
                                    alt="avatar preview"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={handleAvatarClick}
                                className="absolute right-2 bottom-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[#3B28F6] text-white shadow-lg transition hover:scale-110 hover:bg-[#FACC15] hover:text-black"
                            >
                                <Camera size={14} strokeWidth={2.5} />
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </div>
                        <p className="text-center font-['Outfit'] text-[11px] text-gray-500 dark:text-gray-400">
                            Click avatar to upload · Max size 2MB
                        </p>
                    </div>

                    {/* SEBELAH KANAN: Input Profil */}
                    <div className="flex flex-1 flex-col justify-between">
                        <div>
                            <div className="mb-4 flex items-center gap-2">
                                <User size={16} className="text-[#3B28F6] dark:text-[#00d4ff]" />
                                <h2 className="font-['Orbitron'] text-xs font-bold tracking-[2px] text-gray-800 dark:text-white">
                                    IDENTITY PROTOCOL
                                </h2>
                            </div>

                            {profileForm.recentlySuccessful && (
                                <div className="mb-4 border border-green-500/30 bg-green-500/10 px-4 py-2 font-['Outfit'] text-xs font-bold text-green-500 dark:bg-green-500/5">
                                    ✓ Profile updated successfully.
                                </div>
                            )}

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                {/* FULL NAME */}
                                <div className="flex flex-col">
                                    <label className="mb-1 text-[10px] tracking-[2px] text-yellow-600 dark:text-yellow-400 font-bold">
                                        FULL NAME
                                    </label>
                                    <div className="relative flex items-center">
                                        <User className="absolute left-3 text-gray-400 dark:text-[#3B28F6]/60" size={14} />
                                        <input
                                            type="text"
                                            value={profileForm.data.name}
                                            onChange={(e) => profileForm.setData('name', e.target.value)}
                                            className="w-full border border-gray-300 bg-gray-50 pl-9 pr-3 py-2 font-['Oxanium'] text-sm tracking-wide text-gray-800 transition-all outline-none focus:border-[#3B28F6] focus:shadow-[0_0_8px_rgba(59,40,246,0.15)] dark:border-[#3B28F6]/40 dark:bg-[#020208] dark:text-white dark:focus:border-cyan-400 dark:focus:shadow-[0_0_10px_rgba(0,212,255,0.25)]"
                                        />
                                    </div>
                                    {profileForm.errors.name && (
                                        <span className="mt-1 text-xs text-red-500">{profileForm.errors.name}</span>
                                    )}
                                </div>

                                {/* USERNAME */}
                                <div className="flex flex-col">
                                    <label className="mb-1 text-[10px] tracking-[2px] text-yellow-600 dark:text-yellow-400 font-bold">
                                        USERNAME
                                    </label>
                                    <div className="relative flex items-center">
                                        <span className="absolute left-3 text-sm font-bold text-gray-400 dark:text-[#3B28F6]/60">@</span>
                                        <input
                                            type="text"
                                            value={profileForm.data.username}
                                            onChange={(e) => profileForm.setData('username', e.target.value)}
                                            className="w-full border border-gray-300 bg-gray-50 pl-9 pr-3 py-2 font-['Oxanium'] text-sm tracking-wide text-gray-800 transition-all outline-none focus:border-[#3B28F6] focus:shadow-[0_0_8px_rgba(59,40,246,0.15)] dark:border-[#3B28F6]/40 dark:bg-[#020208] dark:text-white dark:focus:border-cyan-400 dark:focus:shadow-[0_0_10px_rgba(0,212,255,0.25)]"
                                        />
                                    </div>
                                    {profileForm.errors.username && (
                                        <span className="mt-1 text-xs text-red-500">{profileForm.errors.username}</span>
                                    )}
                                </div>

                                {/* EMAIL */}
                                <div className="flex flex-col">
                                    <label className="mb-1 text-[10px] tracking-[2px] text-yellow-600 dark:text-yellow-400 font-bold">
                                        EMAIL ADDRESS
                                    </label>
                                    <div className="relative flex items-center">
                                        <Mail className="absolute left-3 text-gray-400 dark:text-[#3B28F6]/60" size={14} />
                                        <input
                                            type="email"
                                            value={profileForm.data.email}
                                            onChange={(e) => profileForm.setData('email', e.target.value)}
                                            className="w-full border border-gray-300 bg-gray-50 pl-9 pr-3 py-2 font-['Oxanium'] text-sm tracking-wide text-gray-800 transition-all outline-none focus:border-[#3B28F6] focus:shadow-[0_0_8px_rgba(59,40,246,0.15)] dark:border-[#3B28F6]/40 dark:bg-[#020208] dark:text-white dark:focus:border-cyan-400 dark:focus:shadow-[0_0_10px_rgba(0,212,255,0.25)]"
                                        />
                                    </div>
                                    {profileForm.errors.email && (
                                        <span className="mt-1 text-xs text-red-500">{profileForm.errors.email}</span>
                                    )}
                                </div>

                                {/* LINKEDIN */}
                                <div className="flex flex-col">
                                    <label className="mb-1 text-[10px] tracking-[2px] text-yellow-600 dark:text-yellow-400 font-bold">
                                        LINKEDIN URL
                                    </label>
                                    <div className="relative flex items-center">
                                        <Link2 className="absolute left-3 text-gray-400 dark:text-[#3B28F6]/60" size={14} />
                                        <input
                                            type="text"
                                            value={profileForm.data.linkedin}
                                            onChange={(e) => profileForm.setData('linkedin', e.target.value)}
                                            placeholder="https://linkedin.com/in/username"
                                            className="w-full border border-gray-300 bg-gray-50 pl-9 pr-3 py-2 font-['Oxanium'] text-sm tracking-wide text-gray-800 transition-all outline-none focus:border-[#3B28F6] focus:shadow-[0_0_8px_rgba(59,40,246,0.15)] dark:border-[#3B28F6]/40 dark:bg-[#020208] dark:text-white dark:focus:border-cyan-400 dark:focus:shadow-[0_0_10px_rgba(0,212,255,0.25)]"
                                        />
                                    </div>
                                    {profileForm.errors.linkedin && (
                                        <span className="mt-1 text-xs text-red-500">{profileForm.errors.linkedin}</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* SUBMIT BUTTON */}
                        <div className="mt-6 flex justify-end">
                            <button
                                type="submit"
                                disabled={profileForm.processing}
                                className="flex items-center justify-center gap-2 px-8 py-2 font-['Orbitron'] text-xs font-bold tracking-widest text-white transition-all hover:opacity-90 hover:shadow-[0_0_16px_rgba(59,40,246,0.5)] disabled:cursor-not-allowed disabled:opacity-50"
                                style={{
                                    background: 'linear-gradient(90deg,#3B28F6,#1a10b0)',
                                    clipPath: 'polygon(12px 0%, 100% 0%, calc(100% - 12px) 100%, 0% 100%)',
                                }}
                            >
                                {profileForm.processing && <Loader2 className="animate-spin" size={14} />}
                                SAVE PROFILE CHANGES &gt;
                            </button>
                        </div>
                    </div>
                </form>

                {/* ══════════ KARTU BAWAH (UBAH KATA SANDI & PERSYARATAN) ══════════ */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    
                    {/* KARTU BAWAH KIRI: Form Ubah Password */}
                    <form
                        onSubmit={handlePasswordSubmit}
                        className="flex flex-col justify-between border-2 border-gray-200 bg-white p-5 shadow-[0_4px_20px_rgba(59,40,246,0.04)] md:p-6 dark:border-[#3B28F6]/60 dark:bg-[#050619] dark:shadow-none"
                        style={{
                            clipPath: 'polygon(0% 0%, 100% 0%, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0% 100%)',
                        }}
                    >
                        <div>
                            <div className="mb-4 flex items-center gap-2">
                                <Lock size={16} className="text-[#3B28F6] dark:text-[#00d4ff]" />
                                <h2 className="font-['Orbitron'] text-xs font-bold tracking-[2px] text-gray-800 dark:text-white">
                                    SECURITY ACCESS
                                </h2>
                            </div>

                            {passwordForm.recentlySuccessful && (
                                <div className="mb-4 border border-green-500/30 bg-green-500/10 px-4 py-2 font-['Outfit'] text-xs font-bold text-green-500 dark:bg-green-500/5">
                                    ✓ Password updated successfully.
                                </div>
                            )}

                            <div className="flex flex-col gap-4">
                                {/* CURRENT PASSWORD */}
                                <div className="flex flex-col">
                                    <label className="mb-1 text-[10px] tracking-[2px] text-yellow-600 dark:text-yellow-400 font-bold">
                                        CURRENT PASSWORD
                                    </label>
                                    <div className="relative flex items-center">
                                        <Lock className="absolute left-3 text-gray-400 dark:text-[#3B28F6]/60" size={14} />
                                        <input
                                            type={showCurrentPass ? 'text' : 'password'}
                                            value={passwordForm.data.current_password}
                                            onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                                            placeholder="••••••••••••••••••••••••"
                                            className="w-full border border-gray-300 bg-gray-50 pl-9 pr-10 py-2 font-['Oxanium'] text-sm tracking-wide text-gray-800 transition-all outline-none focus:border-[#3B28F6] focus:shadow-[0_0_8px_rgba(59,40,246,0.15)] dark:border-[#3B28F6]/40 dark:bg-[#020208] dark:text-white dark:focus:border-cyan-400 dark:focus:shadow-[0_0_10px_rgba(0,212,255,0.25)]"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowCurrentPass(!showCurrentPass)}
                                            className="absolute right-3 text-gray-400 hover:text-gray-600 dark:hover:text-white"
                                        >
                                            {showCurrentPass ? <EyeOff size={15} /> : <Eye size={15} />}
                                        </button>
                                    </div>
                                    {passwordForm.errors.current_password && (
                                        <span className="mt-1 text-xs text-red-500">{passwordForm.errors.current_password}</span>
                                    )}
                                </div>

                                {/* NEW PASSWORD */}
                                <div className="flex flex-col">
                                    <label className="mb-1 text-[10px] tracking-[2px] text-yellow-600 dark:text-yellow-400 font-bold">
                                        NEW PASSWORD
                                    </label>
                                    <div className="relative flex items-center">
                                        <Key className="absolute left-3 text-gray-400 dark:text-[#3B28F6]/60" size={14} />
                                        <input
                                            type={showNewPass ? 'text' : 'password'}
                                            value={passwordForm.data.password}
                                            onChange={(e) => passwordForm.setData('password', e.target.value)}
                                            placeholder="Enter new password"
                                            className="w-full border border-gray-300 bg-gray-50 pl-9 pr-10 py-2 font-['Oxanium'] text-sm tracking-wide text-gray-800 transition-all outline-none focus:border-[#3B28F6] focus:shadow-[0_0_8px_rgba(59,40,246,0.15)] dark:border-[#3B28F6]/40 dark:bg-[#020208] dark:text-white dark:focus:border-cyan-400 dark:focus:shadow-[0_0_10px_rgba(0,212,255,0.25)]"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPass(!showNewPass)}
                                            className="absolute right-3 text-gray-400 hover:text-gray-600 dark:hover:text-white"
                                        >
                                            {showNewPass ? <EyeOff size={15} /> : <Eye size={15} />}
                                        </button>
                                    </div>
                                    {passwordForm.errors.password && (
                                        <span className="mt-1 text-xs text-red-500">{passwordForm.errors.password}</span>
                                    )}
                                </div>

                                {/* CONFIRM PASSWORD */}
                                <div className="flex flex-col">
                                    <label className="mb-1 text-[10px] tracking-[2px] text-yellow-600 dark:text-yellow-400 font-bold">
                                        CONFIRM NEW PASSWORD
                                    </label>
                                    <div className="relative flex items-center">
                                        <Check className="absolute left-3 text-gray-400 dark:text-[#3B28F6]/60" size={14} />
                                        <input
                                            type={showConfirmPass ? 'text' : 'password'}
                                            value={passwordForm.data.password_confirmation}
                                            onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                                            placeholder="Confirm new password"
                                            className="w-full border border-gray-300 bg-gray-50 pl-9 pr-10 py-2 font-['Oxanium'] text-sm tracking-wide text-gray-800 transition-all outline-none focus:border-[#3B28F6] focus:shadow-[0_0_8px_rgba(59,40,246,0.15)] dark:border-[#3B28F6]/40 dark:bg-[#020208] dark:text-white dark:focus:border-cyan-400 dark:focus:shadow-[0_0_10px_rgba(0,212,255,0.25)]"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPass(!showConfirmPass)}
                                            className="absolute right-3 text-gray-400 hover:text-gray-600 dark:hover:text-white"
                                        >
                                            {showConfirmPass ? <EyeOff size={15} /> : <Eye size={15} />}
                                        </button>
                                    </div>
                                    {passwordForm.errors.password_confirmation && (
                                        <span className="mt-1 text-xs text-red-500">{passwordForm.errors.password_confirmation}</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* SUBMIT BUTTON */}
                        <div className="mt-6 flex justify-end">
                            <button
                                type="submit"
                                disabled={passwordForm.processing}
                                className="flex items-center justify-center gap-2 px-8 py-2 font-['Orbitron'] text-xs font-bold tracking-widest text-white transition-all hover:opacity-90 hover:shadow-[0_0_16px_rgba(59,40,246,0.5)] disabled:cursor-not-allowed disabled:opacity-50"
                                style={{
                                    background: 'linear-gradient(90deg,#3B28F6,#1a10b0)',
                                    clipPath: 'polygon(12px 0%, 100% 0%, calc(100% - 12px) 100%, 0% 100%)',
                                }}
                            >
                                {passwordForm.processing && <Loader2 className="animate-spin" size={14} />}
                                UPDATE PASSWORD &gt;
                            </button>
                        </div>
                    </form>

                    {/* KARTU BAWAH KANAN: Persyaratan Sistem */}
                    <div
                        className="flex flex-col justify-between border-2 border-gray-200 bg-white p-5 shadow-[0_4px_20px_rgba(59,40,246,0.04)] md:p-6 dark:border-[#3B28F6]/60 dark:bg-[#050619] dark:shadow-none"
                        style={{
                            clipPath: 'polygon(0% 0%, 100% 0%, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0% 100%)',
                        }}
                    >
                        <div>
                            <div className="mb-4 flex items-center gap-2">
                                <Shield size={16} className="text-[#3B28F6] dark:text-[#00d4ff]" />
                                <h2 className="font-['Orbitron'] text-xs font-bold tracking-[2px] text-gray-800 dark:text-white">
                                    SYSTEM REQUIREMENTS
                                </h2>
                            </div>

                            <ul className="flex flex-col gap-3 font-['Outfit'] text-xs text-gray-600 dark:text-gray-400">
                                <li className="flex items-center gap-2">
                                    <div
                                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                                            reqs.length
                                                ? 'border-green-500 text-green-500 bg-green-500/10'
                                                : 'border-gray-300 dark:border-gray-700'
                                        }`}
                                    >
                                        {reqs.length && <Check size={10} strokeWidth={3} />}
                                    </div>
                                    <span className={reqs.length ? 'text-green-500 font-medium' : ''}>
                                        Minimum 8 characters long
                                    </span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <div
                                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                                            reqs.lowercase
                                                ? 'border-green-500 text-green-500 bg-green-500/10'
                                                : 'border-gray-300 dark:border-gray-700'
                                        }`}
                                    >
                                        {reqs.lowercase && <Check size={10} strokeWidth={3} />}
                                    </div>
                                    <span className={reqs.lowercase ? 'text-green-500 font-medium' : ''}>
                                        At least one lowercase letter
                                    </span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <div
                                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                                            reqs.uppercase
                                                ? 'border-green-500 text-green-500 bg-green-500/10'
                                                : 'border-gray-300 dark:border-gray-700'
                                        }`}
                                    >
                                        {reqs.uppercase && <Check size={10} strokeWidth={3} />}
                                    </div>
                                    <span className={reqs.uppercase ? 'text-green-500 font-medium' : ''}>
                                        At least one uppercase letter
                                    </span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <div
                                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                                            reqs.notCurrent
                                                ? 'border-green-500 text-green-500 bg-green-500/10'
                                                : 'border-gray-300 dark:border-gray-700'
                                        }`}
                                    >
                                        {reqs.notCurrent && <Check size={10} strokeWidth={3} />}
                                    </div>
                                    <span className={reqs.notCurrent ? 'text-green-500 font-medium' : ''}>
                                        Must not match current password
                                    </span>
                                </li>
                            </ul>
                        </div>

                        {/* SECURITY LEVEL DISPLAY */}
                        <div className="mt-8">
                            <div className="flex items-center justify-between border border-gray-200 bg-gray-50 px-4 py-3 font-['Orbitron'] text-xs dark:border-[#3B28F6]/30 dark:bg-[#020208]">
                                <span className="tracking-widest text-gray-500 dark:text-gray-400">
                                    SECURITY LEVEL
                                </span>
                                <div className={`flex items-center gap-2 border px-3 py-1 font-bold tracking-widest ${strengthColor}`}>
                                    <span className={`inline-block h-2 w-2 rounded-full shadow-[0_0_6px] ${strengthDot}`} />
                                    {strength}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}
