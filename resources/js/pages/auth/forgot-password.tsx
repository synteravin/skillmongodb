// Components
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { login } from '@/routes';
import { email } from '@/routes/password';

export default function ForgotPassword({ status }: { status?: string }) {
    return (
        <>
            <Head title="SkillVentura — Forgot Password" />

            {/* ================= FULL BACKGROUND ================= */}
            <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
                {/* GLOW EFFECT */}
                <div className="pointer-events-none absolute inset-0 opacity-40">
                    <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-indigo-600 blur-3xl" />
                    <div className="absolute right-0 bottom-0 h-[500px] w-[500px] rounded-full bg-purple-600 blur-3xl" />
                </div>

                {/* ================= CENTER CONTENT ================= */}
                <div className="relative z-10 flex min-h-screen items-center justify-center px-6">
                    <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
                        {/* LOGO */}
                        <div className="mb-6 flex items-center justify-center gap-2 text-white">
                            <img
                                src="/images/logo.png"
                                className="h-8 w-8"
                                alt="SkillVentura Logo"
                            />
                            <span className="font-semibold">SkillVentura</span>
                        </div>

                        {/* HEADER */}
                        <div className="mb-6 text-center">
                            <h2 className="text-2xl font-semibold text-white">
                                Reset Your Password
                            </h2>
                            <p className="mt-1 text-sm text-slate-400">
                                Enter your email to receive a reset link
                            </p>
                        </div>

                        {/* STATUS */}
                        {status && (
                            <div className="mb-4 rounded-lg bg-emerald-500/10 px-4 py-2 text-center text-sm font-medium text-emerald-400 ring-1 ring-emerald-500/20">
                                {status}
                            </div>
                        )}

                        {/* FORM */}
                        <Form {...email.form()} className="space-y-5">
                            {({ processing, errors }) => (
                                <>
                                    {/* EMAIL */}
                                    <div className="space-y-1">
                                        <Label className="text-slate-300">
                                            Email Address
                                        </Label>

                                        <Input
                                            name="email"
                                            type="email"
                                            placeholder="email@example.com"
                                            autoFocus
                                            className="border-white/10 bg-white/5 text-white placeholder:text-slate-500"
                                        />

                                        <InputError message={errors.email} />
                                    </div>

                                    {/* SUBMIT */}
                                    <Button
                                        disabled={processing}
                                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 font-semibold text-white shadow-lg hover:opacity-90"
                                    >
                                        {processing && (
                                            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                        )}
                                        Send Reset Link
                                    </Button>
                                </>
                            )}
                        </Form>

                        {/* BACK TO LOGIN */}
                        <p className="mt-6 text-center text-sm text-slate-400">
                            Remember your password?{' '}
                            <TextLink
                                href={login()}
                                className="text-indigo-400 hover:underline"
                            >
                                Back to Login
                            </TextLink>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
