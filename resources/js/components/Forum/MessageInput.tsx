import React, { useEffect, useRef, useState } from 'react';
import { Plus, Smile, X, SendHorizontal } from 'lucide-react';
import { Message } from './types';

interface MessageInputProps {
    data: {
        message: string;
        attachment: File | null;
        parent_id: string | null;
    };
    setData: (key: any, value: any) => void;
    processing: boolean;
    onSubmit: (e?: React.FormEvent) => void;
    replyingTo: Message | null;
    onCancelReply: () => void;
    editingMessage: Message | null;
    onCancelEdit: () => void;
    imagePreview: string | null;
    setImagePreview: (preview: string | null) => void;
    errors?: Record<string, string>;
    isMentorOrAdmin?: boolean;
}

const emojis = [
    '😀',
    '😂',
    '🤣',
    '😍',
    '🥰',
    '😘',
    '😜',
    '😎',
    '👍',
    '🔥',
    '🎉',
    '🚀',
    '❤️',
    '👏',
    '🙌',
    '💡',
    '❓',
    '💻',
    '💯',
    '✨',
    '😃',
    '😄',
    '😁',
    '😆',
    '😅',
    '😊',
    '😇',
    '🙂',
    '🙃',
    '😉',
    '😌',
    '😗',
    '😙',
    '😚',
    '😋',
    '😛',
    '😝',
    '🤪',
    '🧐',
    '🤩',
    '🥳',
    '😏',
    '😒',
    '😞',
    '😔',
    '😟',
    '😕',
    '🙁',
    '☹️',
    '😣',
    '😖',
    '😫',
    '😩',
    '🥺',
    '😢',
    '😭',
    '😤',
    '😠',
    '😡',
    '🤬',
    '👋',
    '🤚',
    '🖐️',
    '✋',
    '🖖',
    '👌',
    '🤌',
    '🤏',
    '✌️',
    '🤞',
    '🤟',
    '🤘',
    '🤙',
    '👈',
    '👉',
    '👆',
    '🖕',
    '👇',
    '👎',
    '✊',
    '👊',
    '🤛',
    '🤜',
    '👐',
    '🤲',
    '🤝',
    '🙏',
    '✍️',
    '💅',
    '🤳',
    '💪',
    '🎈',
];

export default function MessageInput({
    data,
    setData,
    processing,
    onSubmit,
    replyingTo,
    onCancelReply,
    editingMessage,
    onCancelEdit,
    imagePreview,
    setImagePreview,
    errors = {},
    isMentorOrAdmin = false,
}: MessageInputProps) {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const emojiPickerRef = useRef<HTMLDivElement | null>(null);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(
                textareaRef.current.scrollHeight,
                150,
            )}px`;
        }
    }, [data.message]);

    // Click outside emoji picker to close it
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                emojiPickerRef.current &&
                !emojiPickerRef.current.contains(event.target as Node)
            ) {
                setShowEmojiPicker(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const addEmoji = (emoji: string) => {
        setData('message', data.message + emoji);
        setShowEmojiPicker(false);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('attachment', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setData('attachment', null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(e);
    };

    return (
        <form
            onSubmit={handleFormSubmit}
            className={`relative flex shrink-0 flex-col gap-2 transition-colors duration-300 ${
                isMentorOrAdmin
                    ? 'border-t border-slate-200 bg-white px-3 py-2.5 pb-[calc(0.6rem+env(safe-area-inset-bottom))] md:px-4 md:py-3 dark:border-slate-800 dark:bg-[#0f0e0e]'
                    : 'gap-2 border-t border-slate-200 bg-white px-3 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] md:gap-3.5 md:px-6 md:py-4 dark:border-white/20 dark:bg-[#0f0e0e]'
            }`}
        >
            {/* Pratinjau Balasan Pesan (Quoted Preview Box) */}
            {replyingTo && (
                <div className="flex w-full items-center justify-between rounded-xl border border-l-4 border-slate-200 border-l-[#3B28F6] bg-slate-50 px-4 py-3 text-xs shadow-inner dark:border-l-4 dark:border-white/20 dark:border-l-[#3B28F6] dark:bg-transparent">
                    <div className="min-w-0 flex-1 pr-4 text-left">
                        <p className="mb-0.5 truncate font-['Oxanium'] font-bold text-indigo-600 dark:text-[#facc15]">
                            {replyingTo.sender.name}
                        </p>
                        <p className="line-clamp-2 font-['Oxanium'] text-[11px] break-words text-slate-500 dark:text-slate-400">
                            {replyingTo.message ?? '[Lampiran Gambar]'}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onCancelReply}
                        className="rounded-full p-1 text-slate-400 transition hover:bg-slate-200 hover:text-slate-950 active:scale-90 dark:hover:bg-slate-900 dark:hover:text-white"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}

            {/* Pratinjau Edit Pesan (Editing Box) */}
            {editingMessage && (
                <div className="flex w-full items-center justify-between rounded-xl border border-l-4 border-slate-200 border-l-[#facc15] bg-slate-50 px-4 py-3 text-xs shadow-inner dark:border-l-4 dark:border-white/20 dark:border-l-[#facc15] dark:bg-transparent">
                    <div className="min-w-0 flex-1 truncate pr-4 text-left">
                        <p className="mb-0.5 font-['Oxanium'] font-bold text-amber-700 dark:text-[#facc15]">
                            Mengedit pesan Anda
                        </p>
                        <p className="truncate font-['Oxanium'] text-[11px] text-slate-500 dark:text-slate-400">
                            {editingMessage.message}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onCancelEdit}
                        className="rounded-full p-1 text-slate-400 transition hover:bg-slate-200 hover:text-slate-950 active:scale-90 dark:hover:bg-slate-900 dark:hover:text-white"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}

            {/* Pratinjau Gambar Sebelum Dikirim */}
            {imagePreview && (
                <div className="flex w-full items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-white/20 dark:bg-transparent">
                    <div className="flex min-w-0 items-center gap-3">
                        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-slate-300 bg-black dark:border-slate-700">
                            <img
                                src={imagePreview}
                                alt="Pratinjau"
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <div className="min-w-0">
                            <p className="truncate text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Siap dikirim
                            </p>
                            <p className="truncate text-[10px] text-slate-400 dark:text-slate-500">
                                Lampiran gambar
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={removeImage}
                        className="shrink-0 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-rose-600 transition hover:bg-slate-100 active:scale-95 dark:border-slate-700 dark:bg-slate-900 dark:text-rose-400 dark:hover:bg-slate-800"
                    >
                        Batal
                    </button>
                </div>
            )}

            {/* Input Wrapper with Status & Counter */}
            <div className="flex w-full flex-col gap-1.5">
                <div className="flex w-full items-end gap-1.5 sm:gap-2 md:gap-3">
                    {/* Tombol Lampirkan File Gambar */}
                    {!editingMessage && (
                        <>
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className={
                                    isMentorOrAdmin
                                        ? 'flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-full border-0 bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-800 active:scale-90 md:h-8 md:w-8 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
                                        : 'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-300 bg-slate-50 text-slate-700 transition hover:bg-slate-100 hover:text-slate-950 active:scale-95 sm:h-10 sm:w-10 dark:border-white dark:bg-black/60 dark:text-white dark:hover:bg-white/10'
                                }
                            >
                                <Plus
                                    className={
                                        isMentorOrAdmin
                                            ? 'h-4.5 w-4.5 text-slate-500 dark:text-slate-400'
                                            : 'h-[18px] w-[18px] sm:h-5 sm:w-5'
                                    }
                                />
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/*"
                                className="hidden"
                            />
                        </>
                    )}

                    {/* Emoji Picker Button */}
                    <div
                        className="relative flex shrink-0"
                        ref={emojiPickerRef}
                    >
                        <button
                            type="button"
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            className={
                                isMentorOrAdmin
                                    ? 'flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-full border-0 bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-800 active:scale-90 md:h-8 md:w-8 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
                                    : 'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-300 bg-slate-50 text-slate-700 transition hover:bg-slate-100 hover:text-slate-950 active:scale-95 sm:h-10 sm:w-10 dark:border-white dark:bg-black/60 dark:text-white dark:hover:bg-white/10'
                            }
                        >
                            <Smile
                                className={
                                    isMentorOrAdmin
                                        ? 'h-4.5 w-4.5 text-slate-500 dark:text-slate-400'
                                        : 'h-[18px] w-[18px] sm:h-5 sm:w-5'
                                }
                            />
                        </button>

                        {showEmojiPicker && (
                            <div className="animate-scale-up absolute bottom-full left-0 z-50 mb-3 flex max-w-[calc(100vw-1.5rem)] flex-col rounded-xl border border-slate-200 bg-white p-3 shadow-2xl dark:border-[#3B28F6]/50 dark:bg-black">
                                <p className="mb-2 text-[10px] font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                                    Emoji Picker
                                </p>
                                <div className="grid h-[160px] w-[220px] grid-cols-6 gap-1 overflow-y-auto sm:w-[240px] sm:grid-cols-8">
                                    {emojis.map((emoji) => (
                                        <button
                                            key={emoji}
                                            type="button"
                                            onClick={() => addEmoji(emoji)}
                                            className="flex h-7 w-7 items-center justify-center rounded text-base transition hover:bg-slate-100 active:scale-95 dark:hover:bg-[#1D215D]/40"
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Kotak Teks Input Pesan */}
                    <textarea
                        ref={textareaRef}
                        placeholder="Ketik pesan..."
                        value={data.message}
                        onChange={(e) => setData('message', e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                if (
                                    (data.message.trim() || data.attachment) &&
                                    data.message.length <= 10000
                                ) {
                                    handleFormSubmit(e as any);
                                }
                            }
                        }}
                        disabled={processing}
                        rows={1}
                        className={
                            isMentorOrAdmin
                                ? 'thin-scrollbar max-h-[100px] min-h-[34px] flex-1 resize-none overflow-y-auto rounded-xl border border-slate-200 bg-slate-100/90 px-3.5 pt-1.5 pb-2 text-sm text-slate-800 placeholder-slate-400 transition-all duration-150 outline-none focus:border-indigo-400 focus:bg-white disabled:opacity-50 md:max-h-[150px] md:px-3 md:pt-1.5 md:pb-2.5 md:text-xs dark:border-slate-800/80 dark:bg-slate-900/90 dark:text-white dark:placeholder-slate-500 dark:focus:border-slate-700'
                                : 'thin-scrollbar max-h-[100px] min-h-[36px] flex-1 resize-none overflow-y-auto rounded-md border border-slate-300 bg-slate-50 px-3 pt-1 pb-3 text-base text-slate-800 placeholder-slate-400 transition-all duration-150 outline-none focus:border-[#3B28F6] focus:bg-white disabled:opacity-50 sm:px-3.5 sm:pt-1.5 sm:pb-3.5 sm:text-sm md:max-h-[150px] md:px-4 md:pt-2 md:pb-4 dark:border-white/30 dark:bg-black dark:text-white dark:placeholder-white/30 dark:focus:border-white'
                        }
                    />

                    {/* Tombol Kirim */}
                    <button
                        type="submit"
                        disabled={
                            processing ||
                            (!data.message.trim() && !data.attachment) ||
                            data.message.length > 10000
                        }
                        className={
                            isMentorOrAdmin
                                ? 'group relative flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-full border-0 bg-[#3B28F6] text-white shadow-md shadow-indigo-600/20 transition-all duration-150 hover:bg-indigo-700 active:scale-95 disabled:pointer-events-none disabled:opacity-30 md:h-8 md:w-8'
                                : 'group relative flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-[#3B28F6]/30 bg-indigo-600 text-white transition-all duration-150 hover:border-indigo-700 hover:bg-indigo-700 active:scale-95 disabled:pointer-events-none disabled:opacity-30 sm:h-10 sm:w-10 dark:border-white/30 dark:bg-black dark:text-white dark:hover:border-white dark:hover:bg-white dark:hover:text-black'
                        }
                    >
                        <SendHorizontal
                            className={
                                isMentorOrAdmin
                                    ? 'h-4 w-4 text-white'
                                    : 'h-[18px] w-[18px] transition-transform duration-150 group-hover:translate-x-0.5 sm:h-5 sm:w-5'
                            }
                        />
                    </button>
                </div>

                {/* Status & Validation Error Row */}
                {(errors?.message || errors?.attachment) && (
                    <div className="flex items-start justify-between px-1 text-xs select-none">
                        <div className="flex-1 font-medium text-red-500">
                            {errors?.message && (
                                <span className="animate-fade-in block">
                                    ⚠️ {errors.message}
                                </span>
                            )}
                            {errors?.attachment && (
                                <span className="animate-fade-in block">
                                    ⚠️ {errors.attachment}
                                </span>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </form>
    );
}
