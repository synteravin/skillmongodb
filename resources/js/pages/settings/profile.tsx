import { Transition } from '@headlessui/react';
import { Form, Head, Link, usePage } from '@inertiajs/react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import DeleteUser from '@/components/delete-user';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit } from '@/routes/profile';
import { send } from '@/routes/verification';
import type { BreadcrumbItem, SharedData } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: edit().url,
    },
];

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth } = usePage<SharedData>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <h1 className="sr-only">Profile Settings</h1>

            <SettingsLayout>
                <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white/50 p-6 shadow-sm dark:border-slate-800 dark:bg-gradient-to-b dark:from-[#0e0e1a]/40 dark:to-[#090910]/20">
                    <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700" />

                    <div className="mb-6 flex items-center gap-4 border-b border-slate-100 pb-5 dark:border-slate-800/60">
                        {/* User Initial Circle */}
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-indigo-500 bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-xs">
                            <span className="text-base font-bold uppercase">
                                {auth.user.name.charAt(0)}
                            </span>
                        </div>
                        <div>
                            <h2 className="text-base font-semibold text-slate-800 dark:text-white">
                                Profile Information
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400/60">
                                Update your personal details and account email
                                address.
                            </p>
                        </div>
                    </div>

                    <Form
                        {...ProfileController.update.form()}
                        options={{
                            preserveScroll: true,
                        }}
                        className="space-y-5"
                    >
                        {({ processing, recentlySuccessful, errors }) => (
                            <>
                                <div className="grid gap-2">
                                    <Label
                                        htmlFor="name"
                                        className="text-xs font-bold tracking-wider text-slate-600 uppercase dark:text-slate-400"
                                    >
                                        Name
                                    </Label>
                                    <Input
                                        id="name"
                                        className="mt-1 block w-full border-slate-200 bg-white/60 dark:border-slate-800 dark:bg-slate-900/60"
                                        defaultValue={auth.user.name}
                                        name="name"
                                        required
                                        autoComplete="name"
                                        placeholder="Full name"
                                    />
                                    <InputError
                                        className="mt-1"
                                        message={errors.name}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label
                                        htmlFor="email"
                                        className="text-xs font-bold tracking-wider text-slate-600 uppercase dark:text-slate-400"
                                    >
                                        Email address
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        className="mt-1 block w-full border-slate-200 bg-white/60 dark:border-slate-800 dark:bg-slate-900/60"
                                        defaultValue={auth.user.email}
                                        name="email"
                                        required
                                        autoComplete="username"
                                        placeholder="Email address"
                                    />
                                    <InputError
                                        className="mt-1"
                                        message={errors.email}
                                    />
                                </div>

                                {mustVerifyEmail &&
                                    auth.user.email_verified_at === null && (
                                        <div className="dark:text-amber-450 rounded-lg border border-amber-500/25 bg-amber-500/5 p-3.5 text-xs text-amber-700">
                                            <p className="leading-relaxed">
                                                Your email address is
                                                unverified.{' '}
                                                <Link
                                                    href={send()}
                                                    as="button"
                                                    className="font-bold underline decoration-amber-500/40 underline-offset-4 transition-colors hover:decoration-amber-500"
                                                >
                                                    Click here to resend the
                                                    verification email.
                                                </Link>
                                            </p>
                                            {status ===
                                                'verification-link-sent' && (
                                                <div className="mt-2 font-bold text-green-600 dark:text-green-400">
                                                    A new verification link has
                                                    been sent to your email
                                                    address.
                                                </div>
                                            )}
                                        </div>
                                    )}

                                <div className="flex items-center gap-4 pt-2">
                                    <Button
                                        disabled={processing}
                                        data-test="update-profile-button"
                                        className="cursor-pointer bg-indigo-600 font-semibold text-white shadow-xs hover:bg-indigo-700"
                                    >
                                        {processing
                                            ? 'Saving...'
                                            : 'Save Changes'}
                                    </Button>

                                    <Transition
                                        show={recentlySuccessful}
                                        enter="transition ease-in-out duration-300"
                                        enterFrom="opacity-0 translate-x-1"
                                        leave="transition ease-in-out duration-300"
                                        leaveTo="opacity-0 -translate-x-1"
                                    >
                                        <p className="dark:text-emerald-450 text-xs font-bold text-emerald-600">
                                            Saved Successfully
                                        </p>
                                    </Transition>
                                </div>
                            </>
                        )}
                    </Form>
                </div>
                <DeleteUser />
            </SettingsLayout>
        </AppLayout>
    );
}
