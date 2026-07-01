import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import SignaturePad from '@/components/signature-pad';
import type { BreadcrumbItem, SharedData } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Signature',
        href: '/signature',
    },
];

export default function Signature() {
    const { auth } = usePage<SharedData>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Signature" />

            <div className="w-full mx-auto space-y-8 p-4 sm:p-6 lg:p-8" style={{ fontFamily: "'Outfit', sans-serif" }}>
                {/* Header Hero Section */}
                <div className="relative overflow-hidden rounded-xl border border-slate-200/80 p-6 sm:p-8 md:p-10 bg-[#f5f6ff] dark:bg-[#0d0f17] dark:border-slate-800 shadow-sm">
                    {/* Grid Pattern Motif */}
                    <div 
                        className="absolute inset-0 z-0 pointer-events-none"
                        style={{
                            backgroundImage: `
                                linear-gradient(rgba(59, 40, 246, 0.07) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(59, 40, 246, 0.07) 1px, transparent 1px)
                            `,
                            backgroundSize: '40px 40px',
                        }}
                    />

                    <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700 z-0" />

                    <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                        <div className="max-w-2xl space-y-3">
                            <span className="inline-block text-[0.6rem] font-semibold tracking-[0.2em] text-indigo-500 uppercase dark:text-indigo-400">
                                Instructor Certification
                            </span>

                            <h1 className="text-2xl md:text-[28px] font-semibold tracking-tight text-slate-800 dark:text-white leading-snug">
                                Digital Signature
                            </h1>

                            <p className="text-slate-500 dark:text-slate-400/60 text-sm md:text-[15px] leading-relaxed">
                                Create and manage your digital signature using type, draw, or image upload options. This signature will be used to automatically sign student certificates upon course completion.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="max-w-3xl rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]">
                    <SignaturePad currentSignatureUrl={auth.user.signature_url} />
                </div>
            </div>
        </AppLayout>
    );
}
