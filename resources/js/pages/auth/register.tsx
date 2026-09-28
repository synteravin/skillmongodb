import { Form, Head } from '@inertiajs/react';
import { AlertCircle, Check, CheckCircle2, Eye, EyeOff, X } from 'lucide-react';
import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import { login } from '@/routes';
import { store } from '@/routes/register';

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);

    // Kriteria Password: 8 karakter, minimal 1 huruf besar, minimal 1 angka, minimal 1 simbol khusus
    const criteria = [
        {
            id: 'length',
            label: 'Minimal 8 karakter',
            missingText: `Kurang ${Math.max(0, 8 - password.length)} karakter (minimal 8 karakter)`,
            isValid: password.length >= 8,
        },
        {
            id: 'uppercase',
            label: 'Minimal 1 huruf besar (A-Z)',
            missingText: 'Belum ada huruf besar / kapital (A-Z)',
            isValid: /[A-Z]/.test(password),
        },
        {
            id: 'number',
            label: 'Minimal 1 angka (0-9)',
            missingText: 'Belum ada angka (0-9)',
            isValid: /[0-9]/.test(password),
        },
        {
            id: 'special',
            label: 'Minimal 1 simbol khusus (@#$ dll)',
            missingText: 'Belum ada karakter spesial / simbol (@, #, $, dll)',
            isValid: /[^A-Za-z0-9]/.test(password),
        },
    ];

    const metCount = criteria.filter((item) => item.isValid).length;
    const isAllCriteriaMet = metCount === criteria.length;
    const missingCriteria = criteria.filter((item) => !item.isValid);

    const isConfirmMatch =
        confirmPassword.length > 0 && password === confirmPassword;
    const isConfirmMismatch =
        confirmPassword.length > 0 && password !== confirmPassword;

    return (
        <>
            <Head title="Register" />

            <div className="flex min-h-screen bg-gray-100 transition-colors dark:bg-[#0a0a12]">
                {/* ================= LEFT SIDE (CARD) ================= */}
                <div className="flex w-full items-center justify-center bg-gradient-to-b from-gray-100 via-white to-gray-200 px-4 py-10 sm:px-6 lg:w-1/2 dark:from-[#0f0f1a] dark:via-[#14002c] dark:to-black">
                    <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg sm:max-w-sm sm:rounded-3xl sm:p-8 lg:max-w-sm lg:p-10 dark:bg-[#0f0f1a]">
                        {/* Neon Border */}
                        <div className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-yellow-400 sm:rounded-3xl" />

                        <h2 className="mb-2 text-xl font-semibold text-gray-900 sm:text-2xl lg:text-3xl dark:text-white">
                            Create an Account
                        </h2>

                        <p className="mb-6 text-xs text-gray-500 sm:mb-8 sm:text-sm dark:text-slate-400">
                            Enter your details below to create your account.
                        </p>

                        <Form
                            {...store.form()}
                            resetOnSuccess={[
                                'password',
                                'password_confirmation',
                            ]}
                            onSuccess={() => {
                                setPassword('');
                                setConfirmPassword('');
                            }}
                            className="space-y-4 sm:space-y-5"
                        >
                            {({ processing, errors }) => (
                                <>
                                    {/* NAME */}
                                    <div>
                                        <Input
                                            name="name"
                                            placeholder="Name"
                                            required
                                            autoFocus
                                            autoComplete="name"
                                            className="border border-gray-300 bg-white text-black placeholder:text-gray-500 dark:border-none dark:bg-[#1c1c2b] dark:text-white dark:placeholder:text-slate-400"
                                        />
                                        <InputError message={errors.name} />
                                    </div>

                                    {/* USERNAME */}
                                    <div>
                                        <Input
                                            name="username"
                                            placeholder="Username"
                                            required
                                            autoComplete="username"
                                            className="border border-gray-300 bg-white text-black placeholder:text-gray-500 dark:border-none dark:bg-[#1c1c2b] dark:text-white dark:placeholder:text-slate-400"
                                        />
                                        <InputError message={errors.username} />
                                    </div>

                                    {/* EMAIL */}
                                    <div>
                                        <Input
                                            name="email"
                                            type="email"
                                            placeholder="Email"
                                            required
                                            autoComplete="email"
                                            className="border border-gray-300 bg-white text-black placeholder:text-gray-500 dark:border-none dark:bg-[#1c1c2b] dark:text-white dark:placeholder:text-slate-400"
                                        />
                                        <InputError message={errors.email} />
                                    </div>

                                    {/* PASSWORD */}
                                    <div className="space-y-2">
                                        <div className="relative">
                                            <Input
                                                name="password"
                                                type={
                                                    showPassword
                                                        ? 'text'
                                                        : 'password'
                                                }
                                                value={password}
                                                onChange={(e) =>
                                                    setPassword(e.target.value)
                                                }
                                                onFocus={() =>
                                                    setIsPasswordFocused(true)
                                                }
                                                onBlur={() =>
                                                    setIsPasswordFocused(false)
                                                }
                                                placeholder="Password (min. 8 characters)"
                                                required
                                                minLength={8}
                                                autoComplete="new-password"
                                                className={cn(
                                                    'border border-gray-300 bg-white pr-10 text-black placeholder:text-gray-500 transition-colors dark:border-none dark:bg-[#1c1c2b] dark:text-white dark:placeholder:text-slate-400',
                                                    password.length > 0 &&
                                                        !isAllCriteriaMet &&
                                                        'border-amber-500/70 focus-visible:ring-amber-500/30 dark:border-amber-500/70',
                                                    password.length > 0 &&
                                                        isAllCriteriaMet &&
                                                        'border-emerald-500/70 focus-visible:ring-emerald-500/30 dark:border-emerald-500/70'
                                                )}
                                            />

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowPassword(!showPassword)
                                                }
                                                aria-label={
                                                    showPassword
                                                        ? 'Hide password'
                                                        : 'Show password'
                                                }
                                                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-black dark:text-slate-400 dark:hover:text-white"
                                            >
                                                {showPassword ? (
                                                    <EyeOff size={18} />
                                                ) : (
                                                    <Eye size={18} />
                                                )}
                                            </button>
                                        </div>

                                        {/* KETERANGAN KEKURANGAN & KRITERIA PASSWORD */}
                                        {(isPasswordFocused ||
                                            password.length > 0) && (
                                            <div className="space-y-2.5 rounded-xl border border-gray-200 bg-gray-50/90 p-3 transition-all dark:border-[#26263b] dark:bg-[#151524]">
                                                {/* Bar Indikator Kekuatan */}
                                                {password.length > 0 && (
                                                    <div className="space-y-1">
                                                        <div className="flex items-center justify-between text-[11px]">
                                                            <span className="text-gray-500 dark:text-slate-400">
                                                                Kekuatan
                                                                Password:
                                                            </span>
                                                            <span
                                                                className={cn(
                                                                    'font-semibold',
                                                                    metCount === 4
                                                                        ? 'text-emerald-500 dark:text-emerald-400'
                                                                        : metCount === 3
                                                                        ? 'text-blue-500 dark:text-blue-400'
                                                                        : metCount === 2
                                                                        ? 'text-amber-500 dark:text-amber-400'
                                                                        : 'text-rose-500 dark:text-rose-400'
                                                                )}
                                                            >
                                                                {metCount === 4
                                                                    ? 'Sangat Kuat'
                                                                    : metCount === 3
                                                                    ? 'Cukup'
                                                                    : metCount === 2
                                                                    ? 'Lemah'
                                                                    : 'Sangat Lemah'}
                                                            </span>
                                                        </div>
                                                        <div className="grid grid-cols-4 gap-1.5">
                                                            {[1, 2, 3, 4].map(
                                                                (step) => (
                                                                    <div
                                                                        key={step}
                                                                        className={cn(
                                                                            'h-1.5 rounded-full transition-all duration-300',
                                                                            step <=
                                                                                metCount
                                                                                ? metCount === 4
                                                                                    ? 'bg-emerald-500'
                                                                                    : metCount === 3
                                                                                    ? 'bg-blue-500'
                                                                                    : metCount === 2
                                                                                    ? 'bg-amber-500'
                                                                                    : 'bg-rose-500'
                                                                                : 'bg-gray-200 dark:bg-[#232338]'
                                                                        )}
                                                                    />
                                                                )
                                                            )}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Peringatan Kekurangan Password yang Belum Terpenuhi */}
                                                {password.length > 0 &&
                                                    !isAllCriteriaMet && (
                                                        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-2.5 text-xs text-amber-800 dark:text-amber-200">
                                                            <div className="flex items-center gap-1.5 font-semibold text-amber-900 dark:text-amber-100">
                                                                <AlertCircle
                                                                    size={14}
                                                                    className="shrink-0 text-amber-600 dark:text-amber-400"
                                                                />
                                                                <span>
                                                                    Kekurangan
                                                                    password:
                                                                </span>
                                                            </div>
                                                            <ul className="mt-1 space-y-0.5 pl-4 list-disc text-[11px] leading-relaxed">
                                                                {missingCriteria.map(
                                                                    (item) => (
                                                                        <li
                                                                            key={
                                                                                item.id
                                                                            }
                                                                            className="text-amber-800 dark:text-amber-200"
                                                                        >
                                                                            {
                                                                                item.missingText
                                                                            }
                                                                        </li>
                                                                    )
                                                                )}
                                                            </ul>
                                                        </div>
                                                    )}

                                                {/* Status Sukses Jika Semua Terpenuhi */}
                                                {password.length > 0 &&
                                                    isAllCriteriaMet && (
                                                        <div className="flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-2 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                                                            <CheckCircle2
                                                                size={15}
                                                                className="shrink-0 text-emerald-500"
                                                            />
                                                            <span>
                                                                Semua kriteria
                                                                password
                                                                terpenuhi!
                                                            </span>
                                                        </div>
                                                    )}

                                                {/* Checklist 4 Kriteria */}
                                                <div className="grid grid-cols-1 gap-1 text-[11px] sm:grid-cols-2">
                                                    {criteria.map((item) => (
                                                        <div
                                                            key={item.id}
                                                            className={cn(
                                                                'flex items-center gap-1.5 transition-colors',
                                                                item.isValid
                                                                    ? 'font-medium text-emerald-600 dark:text-emerald-400'
                                                                    : password.length >
                                                                      0
                                                                    ? 'text-rose-500 dark:text-rose-400'
                                                                    : 'text-gray-500 dark:text-slate-400'
                                                            )}
                                                        >
                                                            {item.isValid ? (
                                                                <Check
                                                                    size={13}
                                                                    className="shrink-0 text-emerald-500"
                                                                />
                                                            ) : password.length >
                                                              0 ? (
                                                                <X
                                                                    size={13}
                                                                    className="shrink-0 text-rose-500"
                                                                />
                                                            ) : (
                                                                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400 dark:bg-slate-500" />
                                                            )}
                                                            <span>
                                                                {item.label}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <InputError
                                            message={errors.password}
                                        />
                                    </div>

                                    {/* CONFIRM PASSWORD */}
                                    <div className="space-y-1.5">
                                        <div className="relative">
                                            <Input
                                                name="password_confirmation"
                                                type={
                                                    showConfirm
                                                        ? 'text'
                                                        : 'password'
                                                }
                                                value={confirmPassword}
                                                onChange={(e) =>
                                                    setConfirmPassword(
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Confirm Password"
                                                required
                                                minLength={8}
                                                autoComplete="new-password"
                                                className={cn(
                                                    'border border-gray-300 bg-white pr-10 text-black placeholder:text-gray-500 transition-colors dark:border-none dark:bg-[#1c1c2b] dark:text-white dark:placeholder:text-slate-400',
                                                    confirmPassword.length >
                                                        0 &&
                                                        isConfirmMismatch &&
                                                        'border-rose-500/70 focus-visible:ring-rose-500/30 dark:border-rose-500/70',
                                                    confirmPassword.length >
                                                        0 &&
                                                        isConfirmMatch &&
                                                        'border-emerald-500/70 focus-visible:ring-emerald-500/30 dark:border-emerald-500/70'
                                                )}
                                            />

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowConfirm(!showConfirm)
                                                }
                                                aria-label={
                                                    showConfirm
                                                        ? 'Hide confirm password'
                                                        : 'Show confirm password'
                                                }
                                                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-black dark:text-slate-400 dark:hover:text-white"
                                            >
                                                {showConfirm ? (
                                                    <EyeOff size={18} />
                                                ) : (
                                                    <Eye size={18} />
                                                )}
                                            </button>
                                        </div>

                                        {/* Status Konfirmasi Password */}
                                        {confirmPassword.length > 0 && (
                                            <div className="text-xs">
                                                {isConfirmMatch ? (
                                                    <div className="flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
                                                        <Check
                                                            size={14}
                                                            className="shrink-0 text-emerald-500"
                                                        />
                                                        <span>
                                                            Konfirmasi password
                                                            cocok
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-1.5 font-medium text-rose-500 dark:text-rose-400">
                                                        <X
                                                            size={14}
                                                            className="shrink-0 text-rose-500"
                                                        />
                                                        <span>
                                                            Konfirmasi password
                                                            belum cocok
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        <InputError
                                            message={
                                                errors.password_confirmation
                                            }
                                        />
                                    </div>

                                    {/* CREATE BUTTON */}
                                    <Button
                                        type="submit"
                                        disabled={
                                            processing ||
                                            (password.length > 0 &&
                                                !isAllCriteriaMet) ||
                                            (confirmPassword.length > 0 &&
                                                isConfirmMismatch)
                                        }
                                        className="w-full bg-[#3B28F6] text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {processing && <Spinner />}
                                        Create account
                                    </Button>

                                    {/* GOOGLE SIGN UP */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 text-gray-600 dark:text-slate-400">
                                            <div className="h-px flex-1 bg-gray-300 dark:bg-slate-600" />
                                            <span className="text-xs sm:text-sm">
                                                Or sign up with
                                            </span>
                                            <div className="h-px flex-1 bg-gray-300 dark:bg-slate-600" />
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                (window.location.href =
                                                    '/auth/google')
                                            }
                                            className="flex w-full items-center justify-center gap-3 rounded-xl border-2 border-indigo-500 py-3 text-gray-800 transition-all duration-300 hover:scale-[1.02] hover:bg-indigo-500/10 hover:shadow-[0_0_20px_rgba(99,102,241,0.7)] active:scale-[0.98] dark:text-white"
                                        >
                                            <FcGoogle size={20} />
                                            Sign up with Google
                                        </button>
                                    </div>

                                    {/* LOGIN LINK */}
                                    <TextLink
                                        href={login()}
                                        className="block w-full rounded-lg border-2 border-indigo-500 py-2 text-center text-indigo-600 transition hover:bg-indigo-500/10 dark:text-white"
                                    >
                                        Already a User? Log in
                                    </TextLink>
                                </>
                            )}
                        </Form>
                    </div>
                </div>

                {/* ================= RIGHT SIDE ================= */}
                <div className="relative hidden w-1/2 items-center justify-center overflow-hidden lg:flex">
                    <img
                        src="/images/background-login.webp"
                        className="absolute inset-0 h-full w-full object-cover"
                        alt="Background"
                    />

                    <div className="relative z-10 rounded-3xl bg-white/10 px-44 py-55 shadow-2xl backdrop-blur-lg dark:bg-white/10">
                        <div className="text-center text-white">
                            <h1 className="text-3xl font-semibold xl:text-4xl">
                                Let's Get <br /> Started
                            </h1>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
