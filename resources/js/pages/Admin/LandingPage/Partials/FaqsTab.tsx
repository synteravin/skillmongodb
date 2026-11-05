import { router } from '@inertiajs/react';
import {
    ArrowDown,
    ArrowUp,
    Edit2,
    HelpCircle,
    Loader2,
    Plus,
    Save,
    Trash2,
} from 'lucide-react';
import React, { useState } from 'react';
import type { FaqItem } from '@/types/landing-page';
import FaqModal from './FaqModal';

interface Props {
    faqs: FaqItem[];
}

export default function FaqsTab({ faqs: initialFaqs }: Props) {
    const [faqList, setFaqList] = useState<FaqItem[]>(initialFaqs || []);
    const [editingFaq, setEditingFaq] = useState<FaqItem | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const openAddFaq = () => {
        setEditingFaq({
            id: `faq-${Date.now()}`,
            question: '',
            answer: '',
            is_active: true,
            order: faqList.length + 1,
        });
        setIsModalOpen(true);
    };

    const openEditFaq = (faq: FaqItem) => {
        setEditingFaq({ ...faq });
        setIsModalOpen(true);
    };

    const handleSaveFaqModal = (savedFaq: FaqItem) => {
        setFaqList((prev) => {
            const exists = prev.some((item) => item.id === savedFaq.id);
            if (exists) {
                return prev.map((item) =>
                    item.id === savedFaq.id ? savedFaq : item,
                );
            }
            return [...prev, savedFaq];
        });
        setIsModalOpen(false);
        setEditingFaq(null);
    };

    const handleDeleteFaq = (id: string) => {
        if (!confirm('Apakah Anda yakin ingin menghapus pertanyaan FAQ ini?')) {
            return;
        }
        setFaqList((prev) =>
            prev
                .filter((item) => item.id !== id)
                .map((item, idx) => ({ ...item, order: idx + 1 })),
        );
    };

    const handleToggleFaqActive = (id: string) => {
        setFaqList((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, is_active: !item.is_active } : item,
            ),
        );
    };

    const moveFaq = (index: number, direction: 'up' | 'down') => {
        if (
            (direction === 'up' && index === 0) ||
            (direction === 'down' && index === faqList.length - 1)
        ) {
            return;
        }
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        const nextList = [...faqList];
        const [moved] = nextList.splice(index, 1);
        nextList.splice(targetIndex, 0, moved);

        const reordered = nextList.map((item, idx) => ({
            ...item,
            order: idx + 1,
        }));
        setFaqList(reordered);
    };

    const submitFaqs = () => {
        setIsSaving(true);
        router.post(
            '/admin/landing-page/faqs',
            { faqs: faqList },
            {
                preserveScroll: true,
                onFinish: () => setIsSaving(false),
            },
        );
    };

    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5 dark:border-slate-800">
                <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                        Frequently Asked Questions (FAQ)
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Kelola pertanyaan dan jawaban yang tampil di bagian FAQ
                        landing page. Urutan pertanyaan dapat diatur naik/turun.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={openAddFaq}
                        className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                    >
                        <Plus className="h-4 w-4" />
                        Tambah FAQ Baru
                    </button>
                    <button
                        type="button"
                        onClick={submitFaqs}
                        disabled={isSaving}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                    >
                        {isSaving ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                            <Save className="h-3.5 w-3.5 text-emerald-500" />
                        )}
                        Simpan
                    </button>
                </div>
            </div>

            {faqList.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-700">
                    <HelpCircle className="mx-auto h-12 w-12 text-slate-400" />
                    <h3 className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">
                        Belum ada FAQ
                    </h3>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        Klik tombol "Tambah FAQ Baru" untuk membuat pertanyaan
                        pertama.
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {faqList.map((faq, index) => (
                        <div
                            key={faq.id || index}
                            className={`flex flex-col gap-3 rounded-2xl border p-4 transition-all sm:flex-row sm:items-center sm:justify-between ${
                                faq.is_active
                                    ? 'border-slate-200/90 bg-white dark:border-slate-800 dark:bg-slate-950/40'
                                    : 'border-slate-200/50 bg-slate-50 opacity-60 dark:border-slate-800/50 dark:bg-slate-900/40'
                            }`}
                        >
                            <div className="flex items-start gap-3.5">
                                <div className="flex flex-col items-center gap-0.5 pt-0.5">
                                    <button
                                        type="button"
                                        onClick={() => moveFaq(index, 'up')}
                                        disabled={index === 0}
                                        className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-25 dark:hover:bg-slate-800"
                                        title="Pindah ke atas"
                                    >
                                        <ArrowUp className="h-3.5 w-3.5" />
                                    </button>
                                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                                        #{index + 1}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => moveFaq(index, 'down')}
                                        disabled={index === faqList.length - 1}
                                        className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-25 dark:hover:bg-slate-800"
                                        title="Pindah ke bawah"
                                    >
                                        <ArrowDown className="h-3.5 w-3.5" />
                                    </button>
                                </div>

                                <div className="space-y-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                            {faq.question}
                                        </h3>
                                        <span
                                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                                faq.is_active
                                                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                                                    : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                                            }`}
                                        >
                                            {faq.is_active
                                                ? 'Aktif'
                                                : 'Nonaktif'}
                                        </span>
                                    </div>
                                    <p className="line-clamp-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                                        {faq.answer}
                                    </p>
                                </div>
                            </div>

                            <div className="flex shrink-0 items-center gap-2 self-end sm:self-center">
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleToggleFaqActive(faq.id)
                                    }
                                    className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
                                        faq.is_active
                                            ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-300'
                                            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300'
                                    }`}
                                >
                                    {faq.is_active ? 'Sembunyikan' : 'Aktifkan'}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => openEditFaq(faq)}
                                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                                >
                                    <Edit2 className="h-3.5 w-3.5 text-indigo-500" />
                                    Edit
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleDeleteFaq(faq.id)}
                                    className="rounded-lg border border-rose-200 bg-rose-50/50 p-1.5 text-rose-600 hover:bg-rose-100 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-400"
                                    title="Hapus FAQ"
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isModalOpen && editingFaq && (
                <FaqModal
                    faq={editingFaq}
                    isEditing={faqList.some((f) => f.id === editingFaq.id)}
                    onClose={() => {
                        setIsModalOpen(false);
                        setEditingFaq(null);
                    }}
                    onSave={handleSaveFaqModal}
                />
            )}
        </div>
    );
}
