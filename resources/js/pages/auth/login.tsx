import { request } from '@/routes/password';
import { Form, Head } from '@inertiajs/react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
}

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: LoginProps) {

    const [showPassword, setShowPassword] = useState(false);

    return (
        <>
            <Head title="Login" />

            {/* ================= MAIN CONTAINER ================= */}
            <div className="flex min-h-screen w-full bg-white dark:bg-black">

                {/* ================= LEFT SIDE LOGIN ================= */}
                <div className="flex w-full items-center justify-center bg-gradient-to-b from-gray-100 via-white to-gray-200 dark:from-[#0f0f1a] dark:via-[#14002c] dark:to-black px-4 py-10 sm:px-6 lg:w-1/2">

                    {/* LOGIN CARD */}
                    <div className="relative w-full max-w-sm sm:max-w-sm lg:max-w-sm rounded-2xl sm:rounded-3xl bg-white dark:bg-[#0f0f1a] p-6 sm:p-8 lg:p-10 shadow-lg dark:shadow-none">

                        {/* Neon Border */}
                        <div className="pointer-events-none absolute inset-0 rounded-2xl sm:rounded-3xl border-2 border-yellow-400" />

                        <h2 className="mb-6 text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900 dark:text-white">
                            Login
                        </h2>

                        <Form
                            {...store.form()}
                            resetOnSuccess={['password']}
                            className="space-y-4 sm:space-y-5"
                        >
                            {({ processing, errors }) => (
                                <>
                                    {/* EMAIL */}
                                    <div>
                                        <Input
                                            name="email"
                                            type="email"
                                            placeholder="Email"
                                            required
                                            className="border border-gray-300 bg-white text-black placeholder:text-gray-500 dark:border-none dark:bg-[#1c1c2b] dark:text-white dark:placeholder:text-slate-400"
                                        />
                                        <InputError message={errors.email} />
                                    </div>

                                    {/* PASSWORD */}
                                    <div className="relative">
                                        <Input
                                            name="password"
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Password"
                                            required
                                            className="border border-gray-300 bg-white text-black placeholder:text-gray-500 pr-10 dark:border-none dark:bg-[#1c1c2b] dark:text-white dark:placeholder:text-slate-400"
                                        />

                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 dark:text-slate-400 hover:text-white"
                                        >
                                            {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                                        </button>
                                    </div>

                                    {/* OPTIONS */}
                                    <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600 dark:text-slate-400">
                                        <label className="flex items-center gap-2">
                                            <Checkbox name="remember"/>
                                            Remember me
                                        </label>

                                        {canResetPassword && (
                                            <TextLink
                                                href={request()}
                                                className="text-yellow-400 hover:underline"
                                            >
                                                Forgot password?
                                            </TextLink>
                                        )}
                                    </div>

                                    {/* LOGIN BUTTON */}
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full bg-[#3B28F6] hover:opacity-90"
                                    >
                                        {processing && <Spinner/>}
                                        Login
                                    </Button>

                                    {/* GOOGLE LOGIN */}
                                    <div className="space-y-4">

                                        <div className="flex items-center gap-3 text-gray-600 dark:text-slate-400">
                                            <div className="h-px flex-1 bg-gray-300 dark:bg-slate-600" />
                                            <span className="text-xs sm:text-sm">Login with</span>
                                            <div className="h-px flex-1 bg-gray-300 dark:bg-slate-600" />
                                        </div>

                                        <button
                                            type="button"
                                            className="flex w-full items-center justify-center gap-3 rounded-xl border-2 border-indigo-500 bg-transparent py-3 text-gray-800 dark:text-white transition-all duration-300 hover:bg-indigo-500/10 hover:shadow-[0_0_20px_rgba(99,102,241,0.7)]"
                                        >
                                            Google
                                        </button>

                                    </div>

                                    {canRegister && (
                                        <p className="text-center text-xs sm:text-sm text-gray-600 dark:text-slate-400">
                                            Don’t have account?{" "}
                                            <TextLink
                                                href={register()}
                                                className="text-yellow-400"
                                            >
                                                Sign up for free
                                            </TextLink>
                                        </p>
                                    )}
                                </>
                            )}
                        </Form>

                        {status && (
                            <div className="mt-4 text-sm text-green-400">
                                {status}
                            </div>
                        )}

                    </div>
                </div>

                {/* ================= RIGHT SIDE BACKGROUND ================= */}
                <div className="relative hidden w-1/2 items-center justify-center overflow-hidden lg:flex">

                    {/* Background */}
                    <img
                        src="/images/background-login.png"
                        className="absolute inset-0 h-full w-full object-cover"
                        alt="Background"
                    />

                    {/* Center Glass Card */}
                    <div className="relative z-10 rounded-3xl bg-white/10 px-42 py-55 xl:px-42 xl:py-55 backdrop-blur-lg shadow-2xl">

                        <div className="text-center text-gray-900 dark:text-white">
                            <h1 className="text-3xl xl:text-4xl font-semibold">
                                Welcome <br /> Back
                            </h1>
                        </div>

                    </div>

                </div>

            </div>
        </>
    );
}