import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { store } from '@/routes/password/confirm';

export default function ConfirmPassword() {
    return (
        <>
            <Head title="Confirm password" />

            {/* ================= MAIN CONTAINER ================= */}
            <div className="flex min-h-screen w-full bg-white dark:bg-black">
                {/* ================= LEFT SIDE CONFIRM PASSWORD ================= */}
                <div className="flex w-full items-center justify-center bg-gradient-to-b from-gray-100 via-white to-gray-200 px-4 py-10 sm:px-6 lg:w-1/2 dark:from-[#0f0f1a] dark:via-[#14002c] dark:to-black">
                    {/* CONFIRM CARD */}
                    <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg sm:max-w-sm sm:rounded-3xl sm:p-8 lg:max-w-sm lg:p-10 dark:bg-[#0f0f1a] dark:shadow-none">
                        {/* Neon Border */}
                        <div className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-yellow-400 sm:rounded-3xl" />

                        {/* Title and Description */}
                        <div className="mb-6 flex flex-col items-center gap-2 text-center">
                            <h1 className="text-2xl font-semibold text-slate-800 dark:text-white">
                                Confirm Password
                            </h1>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                This is a secure area of the application. Please confirm your password before continuing.
                            </p>
                        </div>

                        <Form {...store.form()} resetOnSuccess={['password']}>
                            {({ processing, errors }) => (
                                <div className="space-y-5">
                                    <div className="grid gap-2">
                                        <Label 
                                            htmlFor="password"
                                            className="text-xs font-bold tracking-wider text-slate-600 uppercase dark:text-slate-400"
                                        >
                                            Password
                                        </Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            name="password"
                                            placeholder="Password"
                                            autoComplete="current-password"
                                            autoFocus
                                            className="mt-1 block w-full border-slate-200 bg-white/60 dark:border-slate-800 dark:bg-slate-900/60"
                                        />

                                        <InputError message={errors.password} />
                                    </div>

                                    <div className="pt-2">
                                        <Button
                                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2"
                                            disabled={processing}
                                            data-test="confirm-password-button"
                                        >
                                            {processing && <Spinner />}
                                            Confirm Password
                                        </Button>
                                    </div>
                                </div>
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
