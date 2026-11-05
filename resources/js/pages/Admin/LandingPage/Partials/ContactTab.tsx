import { useForm } from '@inertiajs/react';
import { Loader2, Save } from 'lucide-react';
import React from 'react';
import type { LandingPageContact } from '@/types/landing-page';

interface Props {
    contact: Required<LandingPageContact>;
}

export default function ContactTab({ contact }: Props) {
    const contactForm = useForm<Required<LandingPageContact>>({
        title: contact.title || 'Contact Us',
        subtitle: contact.subtitle || 'Kontak Kami',
        description_1: contact.description_1 || '',
        description_2: contact.description_2 || '',
        support_email: contact.support_email || 'support@skillventura.id',
        working_hours:
            contact.working_hours || 'Senin - Jumat: 08:00 - 16:00 WIB',
    });

    const submitContact = (e: React.FormEvent) => {
        e.preventDefault();
        contactForm.post('/admin/landing-page/contact', {
            preserveScroll: true,
        });
    };

    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5 dark:border-slate-800">
                <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                        Informasi Kontak & Jam Layanan
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Atur teks layanan pelanggan, informasi jam operasional,
                        dan email bantuan yang tampil di section Contact Us.
                    </p>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                    Layanan Bantuan
                </span>
            </div>

            <form onSubmit={submitContact} className="max-w-3xl space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                        <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Judul Section
                        </label>
                        <input
                            type="text"
                            value={contactForm.data.title}
                            onChange={(e) =>
                                contactForm.setData('title', e.target.value)
                            }
                            className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                            placeholder="Contact Us"
                            required
                        />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Subjudul
                        </label>
                        <input
                            type="text"
                            value={contactForm.data.subtitle}
                            onChange={(e) =>
                                contactForm.setData('subtitle', e.target.value)
                            }
                            className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                            placeholder="Kontak Kami"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Deskripsi Paragraf 1 (Jam Operasional & Bantuan)
                    </label>
                    <textarea
                        rows={4}
                        value={contactForm.data.description_1}
                        onChange={(e) =>
                            contactForm.setData('description_1', e.target.value)
                        }
                        className="w-full rounded-xl border border-slate-300 bg-white p-3.5 text-sm leading-relaxed text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                        placeholder="SKILL VENTURA contact support is available..."
                        required
                    />
                </div>

                <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Deskripsi Paragraf 2 (Komitmen Pelayanan)
                    </label>
                    <textarea
                        rows={3}
                        value={contactForm.data.description_2}
                        onChange={(e) =>
                            contactForm.setData('description_2', e.target.value)
                        }
                        className="w-full rounded-xl border border-slate-300 bg-white p-3.5 text-sm leading-relaxed text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                        placeholder="We remain committed to providing helpful..."
                        required
                    />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                        <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Email Support (Opsional)
                        </label>
                        <input
                            type="email"
                            value={contactForm.data.support_email}
                            onChange={(e) =>
                                contactForm.setData(
                                    'support_email',
                                    e.target.value,
                                )
                            }
                            className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                            placeholder="support@skillventura.id"
                        />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Jadwal Jam Kerja (Opsional)
                        </label>
                        <input
                            type="text"
                            value={contactForm.data.working_hours}
                            onChange={(e) =>
                                contactForm.setData(
                                    'working_hours',
                                    e.target.value,
                                )
                            }
                            className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                            placeholder="Senin - Jumat: 08:00 - 16:00 WIB"
                        />
                    </div>
                </div>

                <div className="flex justify-end pt-3">
                    <button
                        type="submit"
                        disabled={contactForm.processing}
                        className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                    >
                        {contactForm.processing ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Save className="h-4 w-4" />
                        )}
                        Simpan Informasi Kontak
                    </button>
                </div>
            </form>
        </div>
    );
}
