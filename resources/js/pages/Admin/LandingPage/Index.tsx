import { Head, usePage } from '@inertiajs/react';
import {
    BookOpen,
    CheckCircle2,
    Compass,
    HelpCircle,
    LayoutTemplate,
    PhoneCall,
    ShieldCheck,
    Users,
} from 'lucide-react';
import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { LandingPageSettingsPayload } from '@/types/landing-page';

import AboutTab from './Partials/AboutTab';
import CommunityTab from './Partials/CommunityTab';
import ContactTab from './Partials/ContactTab';
import FaqsTab from './Partials/FaqsTab';
import VisionMissionTab from './Partials/VisionMissionTab';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Kelola Landing Page',
        href: '/admin/landing-page',
    },
];

type LandingTab = 'about' | 'vision_mission' | 'faqs' | 'community' | 'contact';

interface Props {
    settings: LandingPageSettingsPayload;
}

export default function LandingPageIndex({ settings }: Props) {
    const { flash } = usePage<any>().props;
    const [activeTab, setActiveTab] = useState<LandingTab>('about');

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Landing Page - Admin" />

            <div className="space-y-6 p-4 sm:p-6 lg:p-8">
                {/* ================= HERO HEADER CARD ================= */}
                <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-white via-indigo-50/20 to-slate-50 p-6 shadow-sm sm:p-8 dark:border-slate-800/80 dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-950">
                    {/* Ambient Glow */}
                    <div
                        className="pointer-events-none absolute inset-0 z-0 opacity-70 dark:opacity-35"
                        style={{
                            backgroundImage: `
                                radial-gradient(circle at top right, rgba(124, 92, 255, 0.16), transparent 65%),
                                radial-gradient(circle at bottom left, rgba(56, 189, 248, 0.12), transparent 55%)
                            `,
                        }}
                    />
                    <div className="pointer-events-none absolute top-0 right-10 left-10 z-0 h-px bg-gradient-to-r from-transparent via-indigo-500/35 to-transparent" />

                    <div className="relative z-10 space-y-4">
                        {/* Context Badges */}
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/25 bg-indigo-500/10 px-3 py-1 text-[11px] font-semibold text-indigo-600 dark:border-indigo-400/30 dark:bg-indigo-500/15 dark:text-indigo-300">
                                <LayoutTemplate className="h-3.5 w-3.5" />
                                Konfigurasi Platform
                            </span>
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-white/90 px-2.5 py-1 text-[11px] font-medium text-slate-600 shadow-2xs dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-400">
                                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                                Khusus Admin
                            </span>
                        </div>

                        {/* Title & Description */}
                        <div className="max-w-3xl space-y-2">
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-[32px] dark:text-white">
                                Manajemen Konten Landing Page
                            </h1>
                            <p className="text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-400">
                                Kelola seluruh bagian konten dinamis pada
                                halaman utama publik (About, Visi & Misi, Tanya
                                Jawab FAQ, CTA Komunitas, dan Kontak) secara
                                terpusat, cepat, dan responsif.
                            </p>
                        </div>

                        {/* Feature Badges */}
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                            <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                                Bagian Dikelola:
                            </span>
                            <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200/80 bg-white/90 px-2.5 py-1 text-xs font-medium text-slate-700 shadow-2xs dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300">
                                <BookOpen className="h-3.5 w-3.5 text-indigo-500" />
                                About LMS
                            </span>
                            <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200/80 bg-white/90 px-2.5 py-1 text-xs font-medium text-slate-700 shadow-2xs dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300">
                                <Compass className="h-3.5 w-3.5 text-amber-500" />
                                4 Pilar Visi & Misi
                            </span>
                            <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200/80 bg-white/90 px-2.5 py-1 text-xs font-medium text-slate-700 shadow-2xs dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300">
                                <HelpCircle className="h-3.5 w-3.5 text-sky-500" />
                                {settings.faqs?.length ?? 0} Tanya Jawab (FAQ)
                            </span>
                            <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200/80 bg-white/90 px-2.5 py-1 text-xs font-medium text-slate-700 shadow-2xs dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300">
                                <Users className="h-3.5 w-3.5 text-violet-500" />
                                CTA Komunitas
                            </span>
                            <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200/80 bg-white/90 px-2.5 py-1 text-xs font-medium text-slate-700 shadow-2xs dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300">
                                <PhoneCall className="h-3.5 w-3.5 text-emerald-500" />
                                Layanan Kontak
                            </span>
                        </div>
                    </div>
                </div>

                {/* ================= FLASH MESSAGE ================= */}
                {flash?.success && (
                    <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-50/80 p-4 text-sm text-emerald-800 backdrop-blur-sm dark:border-emerald-500/30 dark:bg-emerald-950/30 dark:text-emerald-300">
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                        <span className="font-medium">{flash.success}</span>
                    </div>
                )}

                {/* ================= TAB NAVIGATION ================= */}
                <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2 dark:border-slate-800">
                    <button
                        onClick={() => setActiveTab('about')}
                        className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                            activeTab === 'about'
                                ? 'bg-indigo-600 text-white shadow-sm dark:bg-indigo-500'
                                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
                        }`}
                    >
                        <BookOpen className="h-4 w-4" />
                        <span>Tentang Platform (About)</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('vision_mission')}
                        className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                            activeTab === 'vision_mission'
                                ? 'bg-indigo-600 text-white shadow-sm dark:bg-indigo-500'
                                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
                        }`}
                    >
                        <Compass className="h-4 w-4" />
                        <span>Visi & Misi (4 Pilar)</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('faqs')}
                        className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                            activeTab === 'faqs'
                                ? 'bg-indigo-600 text-white shadow-sm dark:bg-indigo-500'
                                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
                        }`}
                    >
                        <HelpCircle className="h-4 w-4" />
                        <span>FAQ / Tanya Jawab</span>
                        <span className="rounded-full bg-indigo-200/50 px-2 py-0.5 text-xs text-indigo-900 dark:bg-indigo-900/50 dark:text-indigo-200">
                            {settings.faqs?.length ?? 0}
                        </span>
                    </button>

                    <button
                        onClick={() => setActiveTab('community')}
                        className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                            activeTab === 'community'
                                ? 'bg-indigo-600 text-white shadow-sm dark:bg-indigo-500'
                                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
                        }`}
                    >
                        <Users className="h-4 w-4" />
                        <span>Komunitas (CTA)</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('contact')}
                        className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                            activeTab === 'contact'
                                ? 'bg-indigo-600 text-white shadow-sm dark:bg-indigo-500'
                                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
                        }`}
                    >
                        <PhoneCall className="h-4 w-4" />
                        <span>Kontak & Layanan</span>
                    </button>
                </div>

                {/* ================= MODULAR TAB CONTENTS ================= */}
                {activeTab === 'about' && <AboutTab about={settings.about} />}

                {activeTab === 'vision_mission' && (
                    <VisionMissionTab pillars={settings.vision_mission} />
                )}

                {activeTab === 'faqs' && <FaqsTab faqs={settings.faqs} />}

                {activeTab === 'community' && (
                    <CommunityTab community={settings.community} />
                )}

                {activeTab === 'contact' && (
                    <ContactTab contact={settings.contact} />
                )}
            </div>
        </AppLayout>
    );
}
