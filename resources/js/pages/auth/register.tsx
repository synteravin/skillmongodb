import { Form, Head } from '@inertiajs/react';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';
import { store } from '@/routes/register';

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    return (
        <>
            <Head title="Register" />

            {/* ================= BACKGROUND ================= */}
            <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
                {/* Glow Effects */}
                <div className="pointer-events-none absolute inset-0 opacity-40">
                    <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-indigo-600 blur-3xl" />
                    <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-purple-600 blur-3xl" />
                </div>

                {/* ================= GRID ================= */}
                <div className="relative z-10 grid min-h-screen items-center px-6 lg:grid-cols-2 lg:px-20">
                    {/* ================= LEFT HERO ================= */}
                    <div className="hidden text-white lg:block">
                        <h1 className="text-5xl leading-tight font-bold">
                            Join <br />
                            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                                SkillVentura
                            </span>
                        </h1>

                        <p className="mt-6 max-w-lg text-lg text-slate-300">
                            Mulai perjalanan belajar RPG-mu. Bangun skill,
                            kumpulkan XP, dan capai level tertinggi.
                        </p>

                        <p className="mt-16 text-sm text-slate-500">
                            © 2026 SkillVentura. All rights reserved.
                        </p>
                    </div>

                    {/* ================= RIGHT FORM ================= */}
                    <div className="flex items-center justify-center">
                        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur-xl">
                            {/* TITLE */}
                            <div className="mb-3 text-center">
                                <h2 className="text-2xl font-semibold text-white">
                                    Create Account
                                </h2>
                                <p className="mt-1 text-sm text-slate-400">
                                    Start your adventure today 🚀
                                </p>
                            </div>

                            <Form
                                {...store.form()}
                                resetOnSuccess={[
                                    'password',
                                    'password_confirmation',
                                ]}
                                className="space-y-3"
                            >
                                {({ processing, errors }) => (
                                    <>
                                        {/* NAME */}
                                        <div className="space-y-1">
                                            <Label className="text-slate-300">
                                                Name
                                            </Label>
                                            <Input
                                                name="name"
                                                required
                                                placeholder="Full name"
                                                className="border-white/10 bg-white/5 text-white"
                                            />
                                            <InputError message={errors.name} />
                                        </div>

                                        {/* USERNAME */}
                                        <div className="space-y-1">
                                            <Label className="text-slate-300">
                                                Username
                                            </Label>
                                            <Input
                                                name="username"
                                                required
                                                placeholder="username"
                                                className="border-white/10 bg-white/5 text-white"
                                            />
                                            <InputError
                                                message={errors.username}
                                            />
                                        </div>

                                        {/* EMAIL */}
                                        <div className="space-y-1">
                                            <Label className="text-slate-300">
                                                Email
                                            </Label>
                                            <Input
                                                name="email"
                                                type="email"
                                                required
                                                placeholder="email@example.com"
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
                                            <Input
                                                name="password"
                                                type={
                                                    showPassword
                                                        ? 'text'
                                                        : 'password'
                                                }
                                                required
                                                placeholder="Password"
                                                className="border-white/10 bg-white/5 pr-10 text-white"
                                            />
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
                                            <InputError
                                                message={errors.password}
                                            />
                                        </div>

                                        {/* CONFIRM PASSWORD */}
                                        <div className="relative space-y-1">
                                            <Label className="text-slate-300">
                                                Confirm Password
                                            </Label>
                                            <Input
                                                name="password_confirmation"
                                                type={
                                                    showConfirm
                                                        ? 'text'
                                                        : 'password'
                                                }
                                                required
                                                placeholder="Confirm password"
                                                className="border-white/10 bg-white/5 pr-10 text-white"
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowConfirm(!showConfirm)
                                                }
                                                className="absolute top-[38px] right-3 text-slate-400 hover:text-white"
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

                                        {/* SUBMIT */}
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 font-semibold text-white shadow-lg hover:opacity-90"
                                        >
                                            {processing && <Spinner />}
                                            Create Account
                                        </Button>

                                        {/* LOGIN LINK */}
                                        <p className="text-center text-sm text-slate-400">
                                            Already have an account?{' '}
                                            <TextLink
                                                href={login()}
                                                className="text-indigo-400"
                                            >
                                                Log in
                                            </TextLink>
                                        </p>
                                    </>
                                )}
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
