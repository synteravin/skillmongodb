import { X } from 'lucide-react';
import React, { useState } from 'react';
import type { FaqItem } from '@/types/landing-page';

interface Props {
    faq: FaqItem;
    isEditing: boolean;
    onClose: () => void;
    onSave: (faq: FaqItem) => void;
}

export default function FaqModal({ faq, isEditing, onClose, onSave }: Props) {
    const [formData, setFormData] = useState<FaqItem>(faq);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.question.trim() || !formData.answer.trim()) {
            return;
        }
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
            <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {isEditing ? 'Edit Pertanyaan FAQ' : 'Tambah FAQ Baru'}
                    </h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    <div>
                        <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Pertanyaan (Question)
                        </label>
                        <input
                            type="text"
                            value={formData.question}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    question: e.target.value,
                                })
                            }
                            className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                            placeholder="Contoh: Apa itu SKILL VENTURA?"
                            required
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Jawaban (Answer)
                        </label>
                        <textarea
                            rows={5}
                            value={formData.answer}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    answer: e.target.value,
                                })
                            }
                            className="w-full rounded-xl border border-slate-300 bg-white p-3.5 text-sm leading-relaxed text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                            placeholder="Tuliskan jawaban yang jelas dan informatif..."
                            required
                        />
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                        <input
                            type="checkbox"
                            id="faq_is_active"
                            checked={formData.is_active}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    is_active: e.target.checked,
                                })
                            }
                            className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800"
                        />
                        <label
                            htmlFor="faq_is_active"
                            className="text-xs font-medium text-slate-700 dark:text-slate-300"
                        >
                            Tampilkan di Landing Page (Status Aktif)
                        </label>
                    </div>

                    <div className="flex justify-end gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                        >
                            Terapkan ke Daftar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
