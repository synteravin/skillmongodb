import { Form, Head } from '@inertiajs/react';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { useMemo, useState } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from '@/components/ui/input-otp';
import { OTP_MAX_LENGTH } from '@/hooks/use-two-factor-auth';
import { store } from '@/routes/two-factor/login';

export default function TwoFactorChallenge() {
    const [showRecoveryInput, setShowRecoveryInput] = useState<boolean>(false);
    const [code, setCode] = useState<string>('');

    const authConfigContent = useMemo<{
        title: string;
        description: string;
        toggleText: string;
    }>(() => {
        if (showRecoveryInput) {
            return {
                title: 'Recovery Code',
                description:
                    'Please confirm access to your account by entering one of your emergency recovery codes.',
                toggleText: 'login using an authentication code',
            };
        }

        return {
            title: 'Authentication Code',
            description:
                'Enter the authentication code provided by your authenticator application.',
            toggleText: 'login using a recovery code',
        };
    }, [showRecoveryInput]);

    const toggleRecoveryMode = (clearErrors: () => void): void => {
        setShowRecoveryInput(!showRecoveryInput);
        clearErrors();
        setCode('');
    };

    return (
        <>
            <Head title="Two-Factor Authentication" />

            {/* ================= MAIN CONTAINER ================= */}
            <div className="flex min-h-screen w-full bg-white dark:bg-black">
                {/* ================= LEFT SIDE 2FA CHALLENGE ================= */}
                <div className="flex w-full items-center justify-center bg-gradient-to-b from-gray-100 via-white to-gray-200 px-4 py-10 sm:px-6 lg:w-1/2 dark:from-[#0f0f1a] dark:via-[#14002c] dark:to-black">
                    {/* CHALLENGE CARD */}
                    <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg sm:max-w-sm sm:rounded-3xl sm:p-8 lg:max-w-sm lg:p-10 dark:bg-[#0f0f1a] dark:shadow-none">
                        {/* Neon Border */}
                        <div className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-yellow-400 sm:rounded-3xl" />

                        {/* Title and Description */}
                        <div className="mb-6 flex flex-col items-center gap-2 text-center">
                            <h1 className="text-2xl font-semibold text-slate-800 dark:text-white">
                                {authConfigContent.title}
                            </h1>
                            <p className="text-xs leading-relaxed text-muted-foreground">
                                {authConfigContent.description}
                            </p>
                        </div>

                        <Form
                            {...store.form()}
                            className="space-y-5"
                            resetOnError
                            resetOnSuccess={!showRecoveryInput}
                        >
                            {({ errors, processing, clearErrors }) => (
                                <>
                                    {showRecoveryInput ? (
                                        <div className="grid gap-2">
                                            <Input
                                                name="recovery_code"
                                                type="text"
                                                placeholder="Enter recovery code"
                                                autoFocus={showRecoveryInput}
                                                required
                                                className="mt-1 block w-full border-slate-200 bg-white/60 dark:border-slate-800 dark:bg-slate-900/60"
                                            />
                                            <InputError
                                                message={errors.recovery_code}
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center space-y-3 text-center">
                                            <div className="flex w-full items-center justify-center">
                                                <InputOTP
                                                    name="code"
                                                    maxLength={OTP_MAX_LENGTH}
                                                    value={code}
                                                    onChange={(value) =>
                                                        setCode(value)
                                                    }
                                                    disabled={processing}
                                                    pattern={REGEXP_ONLY_DIGITS}
                                                    autoFocus
                                                >
                                                    <InputOTPGroup>
                                                        {Array.from(
                                                            {
                                                                length: OTP_MAX_LENGTH,
                                                            },
                                                            (_, index) => (
                                                                <InputOTPSlot
                                                                    key={index}
                                                                    index={
                                                                        index
                                                                    }
                                                                />
                                                            ),
                                                        )}
                                                    </InputOTPGroup>
                                                </InputOTP>
                                            </div>
                                            <InputError message={errors.code} />
                                        </div>
                                    )}

                                    <Button
                                        type="submit"
                                        className="w-full cursor-pointer rounded-xl bg-indigo-600 py-3 font-semibold text-white shadow-md shadow-indigo-500/20 transition-all hover:scale-[1.02] hover:bg-indigo-700 active:scale-[0.98]"
                                        disabled={processing}
                                    >
                                        {processing
                                            ? 'Processing...'
                                            : 'Continue'}
                                    </Button>

                                    <div className="pt-2 text-center text-xs text-muted-foreground">
                                        <span>or you can </span>
                                        <button
                                            type="button"
                                            className="text-indigo-650 cursor-pointer font-semibold hover:underline dark:text-indigo-400"
                                            onClick={() =>
                                                toggleRecoveryMode(clearErrors)
                                            }
                                        >
                                            {authConfigContent.toggleText}
                                        </button>
                                    </div>
                                </>
                            )}
                        </Form>
                    </div>
                </div>

                {/* ================= RIGHT SIDE BACKGROUND ================= */}
                <div className="relative hidden w-1/2 items-center justify-center overflow-hidden lg:flex">
                    {/* Background Image */}
                    <img
                        src="/images/background-login.webp"
                        className="absolute inset-0 h-full w-full object-cover"
                        alt="Background"
                    />

                    {/* Center Glass Card */}
                    <div className="relative z-10 rounded-3xl bg-white/10 px-42 py-55 shadow-2xl backdrop-blur-lg xl:px-42 xl:py-55">
                        <div className="text-center text-white">
                            <h1 className="text-3xl font-semibold xl:text-4xl">
                                Secure <br /> Access
                            </h1>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
