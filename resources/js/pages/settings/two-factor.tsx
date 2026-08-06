import { Form, Head, usePage } from '@inertiajs/react';
import { ShieldBan, ShieldCheck, ShieldAlert, QrCode, KeyRound } from 'lucide-react';
import { useState } from 'react';
import Heading from '@/components/heading';
import TwoFactorRecoveryCodes from '@/components/two-factor-recovery-codes';
import TwoFactorSetupModal from '@/components/two-factor-setup-modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTwoFactorAuth } from '@/hooks/use-two-factor-auth';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { disable, enable, show } from '@/routes/two-factor';
import type { BreadcrumbItem, SharedData } from '@/types';

type Props = {
    requiresConfirmation?: boolean;
    twoFactorEnabled?: boolean;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Two-Factor Authentication',
        href: show.url(),
    },
];

export default function TwoFactor({
    requiresConfirmation = false,
    twoFactorEnabled = false,
}: Props) {
    const { auth } = usePage<SharedData>().props;
    const userRole = auth.user.role;
    const isAdminOrMentor = userRole === 'admin' || userRole === 'mentor';

    const {
        qrCodeSvg,
        hasSetupData,
        manualSetupKey,
        clearSetupData,
        fetchSetupData,
        recoveryCodesList,
        fetchRecoveryCodes,
        errors,
    } = useTwoFactorAuth();
    const [showSetupModal, setShowSetupModal] = useState<boolean>(false);

    if (!isAdminOrMentor) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Two-Factor Authentication" />

                <h1 className="sr-only">Two-Factor Authentication Settings</h1>

                <SettingsLayout>
                    <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]">
                        <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700" />

                        <div className="mb-6 border-b border-slate-100 pb-5 dark:border-slate-800/60">
                            <h2 className="text-base font-semibold text-slate-800 dark:text-white">
                                Two-Factor Authentication
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400/60">
                                Manage your two-factor authentication settings.
                            </p>
                        </div>

                        {twoFactorEnabled ? (
                            <div className="flex flex-col items-start justify-start space-y-4">
                                <Badge variant="default">Enabled</Badge>
                                <p className="text-muted-foreground text-sm">
                                    With two-factor authentication enabled, you will
                                    be prompted for a secure, random pin during
                                    login, which you can retrieve from the
                                    TOTP-supported application on your phone.
                                </p>

                                <TwoFactorRecoveryCodes
                                    recoveryCodesList={recoveryCodesList}
                                    fetchRecoveryCodes={fetchRecoveryCodes}
                                    errors={errors}
                                />

                                <div className="relative inline pt-2">
                                    <Form {...disable.form()}>
                                        {({ processing }) => (
                                            <Button
                                                variant="destructive"
                                                type="submit"
                                                disabled={processing}
                                            >
                                                <ShieldBan /> Disable 2FA
                                            </Button>
                                        )}
                                    </Form>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-start justify-start space-y-4">
                                <Badge variant="destructive">Disabled</Badge>
                                <p className="text-muted-foreground text-sm">
                                    When you enable two-factor authentication, you
                                    will be prompted for a secure pin during login.
                                    This pin can be retrieved from a TOTP-supported
                                    application on your phone.
                                </p>

                                <div className="pt-2">
                                    {hasSetupData ? (
                                        <Button
                                            onClick={() => setShowSetupModal(true)}
                                        >
                                            <ShieldCheck />
                                            Continue Setup
                                        </Button>
                                    ) : (
                                        <Form
                                            {...enable.form()}
                                            onSuccess={() =>
                                                setShowSetupModal(true)
                                            }
                                        >
                                            {({ processing }) => (
                                                <Button
                                                    type="submit"
                                                    disabled={processing}
                                                >
                                                    <ShieldCheck />
                                                    Enable 2FA
                                                </Button>
                                            )}
                                        </Form>
                                    )}
                                </div>
                            </div>
                        )}

                        <TwoFactorSetupModal
                            isOpen={showSetupModal}
                            onClose={() => setShowSetupModal(false)}
                            requiresConfirmation={requiresConfirmation}
                            twoFactorEnabled={twoFactorEnabled}
                            qrCodeSvg={qrCodeSvg}
                            manualSetupKey={manualSetupKey}
                            clearSetupData={clearSetupData}
                            fetchSetupData={fetchSetupData}
                            errors={errors}
                        />
                    </div>
                </SettingsLayout>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Two-Factor Authentication" />

            <h1 className="sr-only">Two-Factor Authentication Settings</h1>

            <SettingsLayout>
                {twoFactorEnabled ? (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Left Column: Status Card */}
                        <div className="lg:col-span-7 xl:col-span-8 relative overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]">
                            <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
                            
                            <div className="mb-6 flex items-center gap-4 border-b border-slate-100 pb-5 dark:border-slate-800/60">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-650 dark:text-emerald-400 border border-emerald-100/50 dark:border-emerald-900/30 shadow-xs">
                                    <ShieldCheck className="size-6" />
                                </div>
                                <div>
                                    <h2 className="text-base font-semibold text-slate-800 dark:text-white">
                                        Two-Factor Authentication
                                    </h2>
                                    <p className="text-xs text-slate-500 dark:text-slate-400/60 mt-0.5">
                                        Status: Aktif. Akun Anda saat ini terlindungi dengan verifikasi dua langkah.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center gap-3 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 p-4 text-emerald-800 dark:text-emerald-400 border border-emerald-100/50 dark:border-emerald-900/30">
                                    <div className="flex size-6 items-center justify-center rounded-full bg-emerald-500 text-white flex-shrink-0 shadow-xs">
                                        <ShieldCheck className="size-3.5" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-xs font-bold">Autentikasi Dua Faktor Aktif</p>
                                        <p className="text-[10px] text-emerald-600/90 dark:text-emerald-500 mt-0.5">
                                            Perangkat autentikator Anda berhasil ditautkan.
                                        </p>
                                    </div>
                                </div>

                                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                                    Dengan mengaktifkan autentikasi dua faktor, Anda akan diminta memasukkan PIN keamanan acak selama masuk. PIN ini dapat diperoleh dari aplikasi authenticator (seperti Google Authenticator atau Microsoft Authenticator) di ponsel Anda.
                                </p>

                                <div className="relative inline pt-4 border-t border-slate-100 dark:border-slate-800/60 w-full flex justify-end">
                                    <Form {...disable.form()}>
                                        {({ processing }) => (
                                            <Button
                                                variant="destructive"
                                                type="submit"
                                                disabled={processing}
                                                className="rounded-lg text-xs font-semibold px-4 py-2 cursor-pointer shadow-md shadow-rose-500/10 flex items-center gap-1.5"
                                            >
                                                <ShieldBan className="size-4" /> 
                                                {processing ? 'Menonaktifkan...' : 'Nonaktifkan 2FA'}
                                            </Button>
                                        )}
                                    </Form>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Recovery Codes */}
                        <div className="lg:col-span-5 xl:col-span-4">
                            <TwoFactorRecoveryCodes
                                recoveryCodesList={recoveryCodesList}
                                fetchRecoveryCodes={fetchRecoveryCodes}
                                errors={errors}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Left Column: Enable Card */}
                        <div className="lg:col-span-7 xl:col-span-8 relative overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]">
                            <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700" />
                            
                            <div className="mb-6 flex items-center gap-4 border-b border-slate-100 pb-5 dark:border-slate-800/60">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 border border-slate-200 dark:border-slate-800 shadow-xs">
                                    <ShieldAlert className="size-6" />
                                </div>
                                <div>
                                    <h2 className="text-base font-semibold text-slate-800 dark:text-white">
                                        Two-Factor Authentication
                                    </h2>
                                    <p className="text-xs text-slate-500 dark:text-slate-400/60 mt-0.5">
                                        Status: Belum Aktif. Tambahkan keamanan ekstra pada akun Anda.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center gap-3 rounded-2xl bg-slate-50 dark:bg-slate-900/50 p-4 text-slate-700 dark:text-slate-400 border border-slate-100 dark:border-slate-800">
                                    <div className="flex size-6 items-center justify-center rounded-full bg-slate-200 dark:bg-zinc-850 text-slate-600 dark:text-neutral-450 flex-shrink-0">
                                        <ShieldAlert className="size-3.5" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-xs font-bold">Keamanan Akun Minimum</p>
                                        <p className="text-[10px] text-slate-500 mt-0.5">
                                            Aktifkan 2FA untuk melindungi data penting dan akses kontrol Anda.
                                        </p>
                                    </div>
                                </div>

                                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                                    Autentikasi dua faktor menambahkan lapisan perlindungan ekstra pada akun Anda. Setelah diaktifkan, Anda akan diminta memasukkan kode PIN keamanan dinamis yang dapat diperoleh dari aplikasi authenticator di ponsel Anda setiap kali Anda masuk.
                                </p>

                                <div className="pt-4 border-t border-slate-100 dark:border-slate-800/60 w-full flex justify-end">
                                    {hasSetupData ? (
                                        <Button
                                            onClick={() => setShowSetupModal(true)}
                                            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold px-4 py-2 cursor-pointer shadow-md shadow-indigo-500/20 flex items-center gap-1.5"
                                        >
                                            <QrCode className="size-4" />
                                            Lanjutkan Konfigurasi 2FA
                                        </Button>
                                    ) : (
                                        <Form
                                            {...enable.form()}
                                            onSuccess={() => setShowSetupModal(true)}
                                        >
                                            {({ processing }) => (
                                                <Button
                                                    type="submit"
                                                    disabled={processing}
                                                    className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold px-4 py-2 cursor-pointer shadow-md shadow-indigo-500/20 flex items-center gap-1.5"
                                                >
                                                    <ShieldCheck className="size-4" />
                                                    {processing ? 'Mengaktifkan...' : 'Aktifkan 2FA'}
                                                </Button>
                                            )}
                                        </Form>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Why enable 2FA Info Card */}
                        <div className="lg:col-span-5 xl:col-span-4 relative overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]">
                            <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
                            <div className="mb-4 border-b border-slate-100 pb-4 dark:border-slate-800/60">
                                <h3 className="text-sm font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                                    <KeyRound className="size-4 text-indigo-500" />
                                    Mengapa harus 2FA?
                                </h3>
                            </div>
                            <div className="space-y-4 text-xs text-slate-500 dark:text-slate-400">
                                <div className="space-y-1">
                                    <h4 className="font-semibold text-slate-800 dark:text-white">1. Proteksi Berlapis</h4>
                                    <p className="leading-relaxed text-[11px] text-slate-500 dark:text-slate-450">Bahkan jika orang lain mengetahui kata sandi Anda, mereka tidak akan dapat mengakses akun tanpa PIN keamanan dinamis Anda.</p>
                                </div>
                                <div className="space-y-1">
                                    <h4 className="font-semibold text-slate-800 dark:text-white">2. Keamanan Data Platform</h4>
                                    <p className="leading-relaxed text-[11px] text-slate-500 dark:text-slate-450">Sebagai Admin/Mentor, akun Anda memiliki wewenang mengelola platform. Mengamankan kredensial Anda adalah prioritas utama.</p>
                                </div>
                                <div className="space-y-1">
                                    <h4 className="font-semibold text-slate-800 dark:text-white">3. Standar Industri Modern</h4>
                                    <p className="leading-relaxed text-[11px] text-slate-500 dark:text-slate-450">Menggunakan algoritma TOTP standar yang didukung penuh oleh Google Authenticator, Microsoft Authenticator, Authy, dll.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <TwoFactorSetupModal
                    isOpen={showSetupModal}
                    onClose={() => setShowSetupModal(false)}
                    requiresConfirmation={requiresConfirmation}
                    twoFactorEnabled={twoFactorEnabled}
                    qrCodeSvg={qrCodeSvg}
                    manualSetupKey={manualSetupKey}
                    clearSetupData={clearSetupData}
                    fetchSetupData={fetchSetupData}
                    errors={errors}
                />
            </SettingsLayout>
        </AppLayout>
    );
}
