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

            {/* BACKGROUND */}
            <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
                {/* GLOW */}
                <div className="pointer-events-none absolute inset-0 opacity-40">
                    <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-indigo-600 blur-3xl" />
                    <div className="absolute right-0 bottom-0 h-[500px] w-[500px] rounded-full bg-purple-600 blur-3xl" />
                </div>

                {/* CENTER */}
                <div className="relative z-10 flex min-h-screen items-center justify-center px-6">
                    <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
                        {/* LOGO */}
                        <div className="mb-6 flex items-center justify-center gap-2 text-white">
                            <img src="/images/logo.png" className="h-8 w-8" />
                            <span className="font-semibold">SkillVentura</span>
                        </div>

                        {/* HEADER */}
                        <div className="mb-6 text-center">
                            <h2 className="text-2xl font-semibold text-white">
                                Reset Your Password
                            </h2>
                            <p className="mt-1 text-sm text-slate-400">
                                Create a new key to continue your adventure
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
                                    <div className="space-y-1">
                                        <Label className="text-slate-300">
                                            Email
                                        </Label>
                                        <Input
                                            type="email"
                                            value={email}
                                            readOnly
                                            className="border-white/10 bg-white/5 text-white opacity-70"
                                        />
                                        <InputError message={errors.email} />
                                    </div>

                                    {/* PASSWORD */}
                                    <div className="relative space-y-1">
                                        <Label className="text-slate-300">
                                            New Password
                                        </Label>
                                        <Input
                                            name="password"
                                            type={
                                                showPassword
                                                    ? 'text'
                                                    : 'password'
                                            }
                                            placeholder="New password"
                                            required
                                            className="border-white/10 bg-white/5 pr-10 text-white"
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                            className="absolute top-[38px] right-3 text-slate-400 hover:text-white"
                                        >
                                            {showPassword ? (
                                                <EyeOff size={18} />
                                            ) : (
                                                <Eye size={18} />
                                            )}
                                        </button>
                                        <InputError message={errors.password} />
                                    </div>

                                    {/* CONFIRM */}
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
                                            placeholder="Confirm password"
                                            required
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
