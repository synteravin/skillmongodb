import { Form, Head } from '@inertiajs/react';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { update } from '@/routes/password';

interface ResetPasswordProps {
    token: string;
    email: string;
}

export default function ResetPassword({ token, email }: ResetPasswordProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    return (
        <>
            <Head title="SkillVentura — Reset Password" />

            {/* ================= FULL BACKGROUND ================= */}
            <div className="relative min-h-screen overflow-hidden">

                {/* Background Image */}
                <img
                    src="/images/background-login.png"
                    className="absolute inset-0 h-full w-full object-cover"
                />

                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-white/60 dark:bg-black/60 backdrop-blur-[1px]" />

                {/* ================= CENTER CONTENT ================= */}
                <div className="relative z-10 flex min-h-screen items-center justify-center px-6">

                    {/* CARD */}
                    <div className="relative w-full max-w-md rounded-[30px] bg-[#0f0f1a] p-10">

                        {/* Neon Border */}
                        <div className="pointer-events-none absolute inset-0 rounded-[30px] border-2 border-yellow-400/70 dark:border-yellow-400" />

                        {/* HEADER */}
                        <div className="mb-6 text-center">
                            <h2 className="text-2xl font-semibold text-white">
                                Reset Password
                            </h2>
                            <p className="mt-2 text-sm text-slate-400">
                                Create a new password for your account
                            </p>
                        </div>

                        <Form
                            {...update.form()}
                            transform={(data) => ({
                                ...data,
                                token,
                                email,
                            })}
                            resetOnSuccess={[
                                'password',
                                'password_confirmation',
                            ]}
                            className="space-y-5"
                        >
                            {({ processing, errors }) => (
                                <>
                                    {/* EMAIL */}
                                    <div className="space-y-2">
                                        <Label className="text-slate-300">
                                            Email
                                        </Label>

                                        <Input
                                            type="email"
                                            value={email}
                                            readOnly
                                            className="border-none bg-[#1c1c2b] text-white opacity-70"
                                        />

                                        <InputError message={errors.email} />
                                    </div>

                                    {/* PASSWORD */}
                                    <div className="relative space-y-2">
                                        <Label className="text-slate-300">
                                            New Password
                                        </Label>

                                        <Input
                                            name="password"
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="New password"
                                            required
                                            className="border-none bg-[#1c1c2b] pr-10 text-white placeholder:text-slate-400"
                                        />

                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-[38px] text-slate-400 hover:text-white"
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
                                    <div className="relative space-y-2">
                                        <Label className="text-slate-300">
                                            Confirm Password
                                        </Label>

                                        <Input
                                            name="password_confirmation"
                                            type={showConfirm ? 'text' : 'password'}
                                            placeholder="Confirm password"
                                            required
                                            className="border-none bg-[#1c1c2b] pr-10 text-white placeholder:text-slate-400"
                                        />

                                        <button
                                            type="button"
                                            onClick={() => setShowConfirm(!showConfirm)}
                                            className="absolute right-3 top-[38px] text-slate-400 hover:text-white"
                                        >
                                            {showConfirm ? (
                                                <EyeOff size={18} />
                                            ) : (
                                                <Eye size={18} />
                                            )}
                                        </button>

                                        <InputError message={errors.password_confirmation} />
                                    </div>

                                    {/* SUBMIT */}
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                                    >
                                        {processing && <Spinner />}
                                        Reset Password
                                    </Button>
                                </>
                            )}
                        </Form>
                    </div>
                </div>
            </div>
        </>
    );
}