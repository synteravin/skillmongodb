import { Form, Head } from '@inertiajs/react';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';
import { store } from '@/routes/register';

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

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
                                    <div className="relative">
                                        <Input
                                            name="password"
                                            type={
                                                showPassword
                                                    ? 'text'
                                                    : 'password'
                                            }
                                            placeholder="Password (min. 8 characters)"
                                            required
                                            minLength={8}
                                            autoComplete="new-password"
                                            className="border border-gray-300 bg-white pr-10 text-black placeholder:text-gray-500 dark:border-none dark:bg-[#1c1c2b] dark:text-white dark:placeholder:text-slate-400"
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

                                        <InputError message={errors.password} />
                                    </div>

                                    {/* CONFIRM PASSWORD */}
                                    <div className="relative">
                                        <Input
                                            name="password_confirmation"
                                            type={
                                                showConfirm
                                                    ? 'text'
                                                    : 'password'
                                            }
                                            placeholder="Confirm Password"
                                            required
                                            minLength={8}
                                            autoComplete="new-password"
                                            className="border border-gray-300 bg-white pr-10 text-black placeholder:text-gray-500 dark:border-none dark:bg-[#1c1c2b] dark:text-white dark:placeholder:text-slate-400"
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

                                        <InputError
                                            message={
                                                errors.password_confirmation
                                            }
                                        />
                                    </div>

                                    {/* CREATE BUTTON */}
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full bg-[#3B28F6] text-white hover:opacity-90"
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
