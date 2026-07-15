import { Form, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { login } from '@/routes';
import { email } from '@/routes/password';

export default function ForgotPassword({ status }: { status?: string }) {
    return (
        <>
            <Head title="SkillVentura — Forgot Password" />

            {/* ================= FULL BACKGROUND ================= */}
            <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-6 transition-colors duration-300 sm:px-6 md:px-8 lg:px-10">
                {/* Background Image */}
                <img
                    src="/images/background-login.webp"
                    alt="Background"
                    className="absolute inset-0 h-full w-full object-cover"
                />

                {/* ================= CARD ================= */}
                <div
                    className="relative w-[96%] max-w-md sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl 2xl:max-w-3xl rounded-3xl border border-white/20 bg-white/20 p-6 shadow-2xl backdrop-blur-lg transition-all duration-300 sm:p-7 md:p-8 lg:p-9 xl:p-10 2xl:p-12 dark:border-white/10 dark:bg-slate-900/35 dark:backdrop-blur-xl">
                    
                    {/* Neon Border */}
                    <div className="pointer-events-none absolute inset-0 rounded-3xl border-2 border-yellow-400/70" />

                    {/* ================= HEADER ================= */}
                    <div className="mb-6 text-center text-white">
                        <h2 className="text-2xl font-semibold sm:text-3xl">
                            Forgot Password
                        </h2>

                        <p className="mt-3 text-sm leading-relaxed text-white/80">
                            Enter your email to receive a password reset link.
                        </p>
                    </div>

                    {/* ================= STATUS ================= */}
                    {status && (
                        <div className="mb-5 rounded-xl border border-emerald-400/30 bg-emerald-500/15 px-4 py-3 text-center text-sm text-emerald-100 backdrop-blur-md">
                            {status}
                        </div>
                    )}

                    {/* ================= FORM ================= */}
                    <Form {...email.form()} className="space-y-5">
                        {({ processing, errors }) => (
                            <>
                                {/* EMAIL */}
                                <div>
                                    <Input
                                        name="email"
                                        type="email"
                                        placeholder="Email"
                                        autoFocus
                                        className="border border-white/20 bg-white/10 text-white placeholder:text-white/60 backdrop-blur-md transition-all duration-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500 dark:bg-white/5"
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                {/* SUBMIT BUTTON */}
                                <Button
                                    disabled={processing}
                                    className="w-full bg-indigo-600 py-2.5 text-white transition-all duration-300 hover:bg-indigo-700"
                                >
                                    {processing && (
                                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    Email password reset link
                                </Button>

                                {/* LOGIN LINK */}
                                <TextLink
                                    href={login()}
                                    className="block w-full rounded-xl border border-white/20 py-2.5 text-center text-white transition-all duration-300 hover:bg-white/10"
                                >
                                    Or, return to Log in
                                </TextLink>
                            </>
                        )}
                    </Form>
                </div>
            </div>
        </>
    );
}
