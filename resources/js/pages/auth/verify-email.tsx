import { Form, Head, Link } from '@inertiajs/react';
import {
    CheckCircle2,
    LoaderCircle,
    LogOut,
    Mail,
    MailCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { logout } from '@/routes';
import { send } from '@/routes/verification';

export default function VerifyEmail({ status }: { status?: string }) {
    return (
        <>
            <Head title="SkillVentura — Verifikasi Email" />

            {/* ================= FULL BACKGROUND ================= */}
            <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-8 sm:px-6 md:px-8">
                {/* Background Image */}
                <img
                    src="/images/background-login.webp"
                    alt="Background"
                    className="absolute inset-0 h-full w-full object-cover"
                />

                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />

                {/* ================= CARD ================= */}
                <div className="relative w-[96%] max-w-md rounded-3xl border border-white/20 bg-white/15 p-6 shadow-2xl backdrop-blur-xl transition-all duration-300 sm:max-w-md sm:p-8 md:max-w-lg md:p-9 dark:border-white/10 dark:bg-slate-900/50">
                    {/* Neon Border */}
                    <div className="pointer-events-none absolute inset-0 rounded-3xl border-2 border-yellow-400/70 shadow-[0_0_15px_rgba(250,204,21,0.2)]" />

                    {/* Logo */}
                    <div className="mb-6 text-center">
                        <Link
                            href="/"
                            className="inline-block transition-transform duration-200 hover:scale-105"
                        >
                            <img
                                src="/images/logo.webp"
                                alt="SkillVentura Logo"
                                className="mx-auto h-12 w-auto object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
                            />
                        </Link>
                    </div>

                    {/* Icon Badge */}
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-yellow-400/30 bg-gradient-to-br from-yellow-400/20 via-indigo-500/20 to-purple-600/30 text-yellow-300 shadow-lg shadow-yellow-500/10 backdrop-blur-md">
                        <MailCheck className="h-8 w-8 text-yellow-400 animate-pulse" />
                    </div>

                    {/* Header Text */}
                    <div className="mb-6 text-center text-white">
                        <h2
                            className="text-2xl font-bold tracking-tight sm:text-3xl"
                            style={{ fontFamily: 'Orbitron, sans-serif' }}
                        >
                            Verifikasi Email
                        </h2>

                        <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-white/80">
                            Terima kasih telah bergabung di SkillVentura!
                            Silakan klik tautan verifikasi yang telah kami
                            kirimkan ke alamat email Anda.
                        </p>
                    </div>

                    {/* Status Message */}
                    {status === 'verification-link-sent' && (
                        <div className="mb-5 flex items-start gap-2.5 rounded-2xl border border-emerald-400/40 bg-emerald-500/20 p-3.5 text-left text-xs sm:text-sm text-emerald-100 shadow-md backdrop-blur-md">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                            <div className="leading-relaxed">
                                <strong className="font-semibold text-white">
                                    Tautan Terkirim!
                                </strong>{' '}
                                Tautan verifikasi baru telah berhasil dikirimkan
                                ke email yang Anda daftarkan.
                            </div>
                        </div>
                    )}

                    {/* Form Actions */}
                    <Form {...send.form()} className="space-y-4">
                        {({ processing }) => (
                            <>
                                <Button
                                    disabled={processing}
                                    className="w-full cursor-pointer rounded-xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-yellow-400/25 transition-all duration-200 hover:from-yellow-300 hover:to-amber-400 hover:shadow-yellow-400/35 active:scale-[0.98] disabled:opacity-50"
                                    style={{
                                        fontFamily: 'Orbitron, sans-serif',
                                    }}
                                >
                                    {processing ? (
                                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin text-slate-950" />
                                    ) : (
                                        <Mail className="mr-2 h-4 w-4 text-slate-950" />
                                    )}
                                    Kirim Ulang Email Verifikasi
                                </Button>

                                <div className="pt-1">
                                    <Link
                                        href={logout().url}
                                        method="post"
                                        as="button"
                                        className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 py-2.5 text-center text-xs sm:text-sm font-semibold text-white/90 backdrop-blur-md transition-all duration-300 hover:border-white/40 hover:bg-white/20 hover:text-white active:scale-95"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        <span>Keluar Akun (Log out)</span>
                                    </Link>
                                </div>
                            </>
                        )}
                    </Form>
                </div>
            </div>
        </>
    );
}
