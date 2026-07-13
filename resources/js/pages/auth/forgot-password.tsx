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
            <div className="relative flex min-h-screen items-center justify-center bg-gray-100 px-4 py-8 transition-colors sm:px-6 lg:px-8 dark:bg-[#0b0b14]">
                {/* Background Image */}
                <img
                    src="/images/background-login.png"
                    alt="Background"
                    className="absolute inset-0 h-full w-full object-cover"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] dark:bg-black/60" />

                {/* ================= CARD ================= */}
                <div className="relative w-full max-w-sm rounded-[30px] bg-white p-6 shadow-xl sm:max-w-sm sm:p-8 lg:max-w-lg lg:p-10 dark:bg-[#0f0f1a]">
                    {/* Neon Border */}
                    <div className="pointer-events-none absolute inset-0 rounded-[30px] border-2 border-yellow-400/70 dark:border-yellow-400" />

                    {/* HEADER */}
                    <div className="mb-6 text-center text-gray-900 dark:text-white">
                        <h2 className="text-xl font-semibold sm:text-2xl lg:text-3xl">
                            Forgot Password
                        </h2>

                        <p className="mt-2 text-xs text-gray-500 sm:text-sm dark:text-slate-400">
                            Enter your email to receive a password reset link.
                        </p>
                    </div>

                    {/* STATUS */}
                    {status && (
                        <div className="mb-4 rounded-lg bg-emerald-500/10 px-4 py-2 text-center text-sm text-emerald-500 ring-1 ring-emerald-500/20">
                            {status}
                        </div>
                    )}

                    {/* FORM */}
                    <Form {...email.form()} className="space-y-4 sm:space-y-5">
                        {({ processing, errors }) => (
                            <>
                                {/* EMAIL */}
                                <div>
                                    <Input
                                        name="email"
                                        type="email"
                                        placeholder="Email"
                                        autoFocus
                                        className="border border-gray-200 bg-gray-50 text-gray-900 transition-all duration-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 dark:border-none dark:bg-[#1c1c2b] dark:text-white dark:placeholder:text-slate-400"
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                {/* SUBMIT BUTTON */}
                                <Button
                                    disabled={processing}
                                    className="w-full bg-indigo-600 text-white hover:bg-indigo-700"
                                >
                                    {processing && (
                                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    Email password reset link
                                </Button>

                                {/* LOGIN LINK */}
                                <TextLink
                                    href={login()}
                                    className="block w-full rounded-lg border-2 border-indigo-500 py-2 text-center text-indigo-600 transition-all duration-300 hover:bg-indigo-500/10 dark:text-white"
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
