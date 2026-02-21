import { request } from '@/routes/password';
import { Form, Head } from '@inertiajs/react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

            {/* ================= FULL BACKGROUND ================= */}
            <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
                {/* GLOW EFFECT */}
                <div className="pointer-events-none absolute inset-0 opacity-40">
                    <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-indigo-600 blur-3xl" />
                    <div className="absolute right-0 bottom-0 h-[500px] w-[500px] rounded-full bg-purple-600 blur-3xl" />
                </div>

                {/* ================= GRID ================= */}
                <div className="relative z-10 grid min-h-screen items-center px-6 lg:grid-cols-2 lg:px-20">
                    {/* ================= LEFT HERO ================= */}
                    <div className="hidden text-white lg:block">
                        {/* LOGO */}
                        <div className="mb-10 flex items-center gap-3">
                            <img
                                src="/images/logo.png"
                                className="h-30 w-30 drop-shadow-[0_0_8px_rgba(255,255,255,5.5)]"
                                alt="SkillVentura Logo"
                            />
                            {/* <span className="text-xl font-semibold tracking-wide">
                                SkillVentura
                            </span> */}
                        </div>

                        {/* TITLE */}
                        <h1 className="text-5xl leading-tight font-bold">
                            Begin Your Journey in <br />
                            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                                SkillVentura
                            </span>
                        </h1>

                        {/* DESCRIPTION */}
                        <p className="mt-6 max-w-lg text-lg text-slate-300">
                            Level up your skills through quests, challenges, and
                            interactive learning paths. Build your digital
                            career like an RPG adventure.
                        </p>

                        {/* RPG BULLETS */}
                        <ul className="mt-8 space-y-2 text-sm text-slate-400">
                            <li>⚔️ Complete Learning Quests</li>
                            <li>🏆 Earn XP & Achievements</li>
                            <li>🚀 Unlock Career Paths</li>
                        </ul>

                        <p className="mt-16 text-sm text-slate-500">
                            © 2026 SkillVentura. All rights reserved.
                        </p>
                    </div>

                    {/* ================= RIGHT FORM ================= */}
                    <div className="flex items-center justify-center">
                        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
                            {/* MOBILE LOGO */}
                            <div className="mb-6 flex items-center justify-center gap-2 text-white lg:hidden">
                                <img
                                    src="/images/logo.png"
                                    className="h-8 w-8"
                                />
                                <span className="font-semibold">
                                    SkillVentura
                                </span>
                            </div>

                            {/* HEADER */}
                            <div className="mb-6 text-center">
                                <h2 className="text-2xl font-semibold text-white">
                                    Continue Your Adventure
                                </h2>
                                <p className="mt-1 text-sm text-slate-400">
                                    Enter your credentials to access your world
                                </p>
                            </div>

                            <Form
                                {...store.form()}
                                resetOnSuccess={['password']}
                                className="space-y-5"
                            >
                                {({ processing, errors }) => (
                                    <>
                                        {/* EMAIL */}
                                        <div className="space-y-1">
                                            <Label className="text-slate-300">
                                                Email
                                            </Label>
                                            <Input
                                                name="email"
                                                placeholder="Email address"
                                                type="email"
                                                required
                                                className="border-white/10 bg-white/5 text-white"
                                            />
                                            <InputError
                                                message={errors.email}
                                            />
                                        </div>

                                        {/* PASSWORD */}
                                        <div className="relative space-y-1">
                                            <Label className="text-slate-300">
                                                Password
                                            </Label>
                                            {/* forgot password */}
                                            {canResetPassword && (
                                                <div className="absolute top-0 right-0">
                                                    <TextLink
                                                        href={request()}
                                                        className="text-sm text-indigo-400 hover:underline"
                                                    >
                                                        Forgot password?
                                                    </TextLink>
                                                </div>
                                            )}

                                            <Input
                                                name="password"
                                                placeholder="Your password"
                                                type={
                                                    showPassword
                                                        ? 'text'
                                                        : 'password'
                                                }
                                                required
                                                className="border-white/10 bg-white/5 pr-10 text-white"
                                            />

                                            {/* TOGGLE BUTTON */}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowPassword(
                                                        !showPassword,
                                                    )
                                                }
                                                className="absolute top-[38px] right-3 text-slate-400 hover:text-white"
                                            >
                                                {showPassword ? (
                                                    <EyeOff size={18} />
                                                ) : (
                                                    <Eye size={18} />
                                                )}
                                            </button>
                                        </div>

                                        {/* REMEMBER */}
                                        <div className="flex items-center gap-2 text-slate-300">
                                            <Checkbox name="remember" />
                                            <Label>Remember me</Label>
                                        </div>

                                        {/* SUBMIT */}
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 font-semibold text-white shadow-lg hover:opacity-90"
                                        >
                                            {processing && <Spinner />}
                                            Login
                                        </Button>

                                        <div className="flex items-center gap-3 text-slate-500">
                                            <div className="h-px flex-1 bg-white/10" />
                                            <span className="text-xs">OR</span>
                                            <div className="h-px flex-1 bg-white/10" />
                                        </div>

                                        {/* GOOGLE OAUTH */}
                                        <a
                                            href="/auth/google"
                                            className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/15 bg-white/10 px-4 py-2 font-semibold text-white transition hover:bg-white/20"
                                        >
                                            <img
                                                src="/images/google-logo.png"
                                                className="h-5 w-5"
                                                alt="Google"
                                            />
                                            Continue with Google
                                        </a>

                                        {/* REGISTER */}
                                        {canRegister && (
                                            <p className="text-center text-sm text-slate-400">
                                                Don’t have an account?{' '}
                                                <TextLink
                                                    href={register()}
                                                    className="text-indigo-400"
                                                >
                                                    Sign up
                                                </TextLink>
                                            </p>
                                        )}
                                    </>
                                )}
                            </Form>

                            {/* STATUS */}
                            {status && (
                                <div className="mt-4 text-center text-sm text-green-400">
                                    {status}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
