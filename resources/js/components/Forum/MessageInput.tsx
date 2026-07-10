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
}

const emojis = [
    '😀', '😂', '🤣', '😍', '🥰', '😘', '😜', '😎',
    '👍', '🔥', '🎉', '🚀', '❤️', '👏', '🙌', '💡',
    '❓', '💻', '💯', '✨', '😃', '😄', '😁', '😆',
    '😅', '😊', '😇', '🙂', '🙃', '😉', '😌', '😗',
    '😙', '😚', '😋', '😛', '😝', '🤪', '🧐', '🤩',
    '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁',
    '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭',
    '😤', '😠', '😡', '🤬', '👋', '🤚', '🖐️', '✋',
    '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘',
    '🤙', '👈', '👉', '👆', '🖕', '👇', '👎', '✊',
    '👊', '🤛', '🤜', '👐', '🤲', '🤝', '🙏', '✍️',
    '💅', '🤳', '💪', '🎈',
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
                150
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
        className="relative flex shrink-0 flex-col gap-2 md:gap-3.5 border-t border-white/20 bg-[#121212] px-3 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] md:px-6 md:py-4"
    >
        {/* Pratinjau Balasan Pesan (Quoted Preview Box) */}
        {replyingTo && (
            <div className="flex w-full items-center justify-between rounded-xl border border-white/20 border-l-4 border-l-[#3B28F6] bg-transparent px-4 py-3 text-xs shadow-inner">
                <div className="min-w-0 flex-1 pr-4 text-left">
                    <p className="mb-0.5 font-['Oxanium'] font-bold text-[#facc15] truncate">
                        {replyingTo.sender.name}
                    </p>
                    <p className="line-clamp-2 break-words font-['Oxanium'] text-[11px] text-slate-400">
                        {replyingTo.message ?? '[Lampiran Gambar]'}
                    </p>
                </div>
                <button
                    type="button"
                    onClick={onCancelReply}
                    className="rounded-full p-1 text-slate-400 transition hover:bg-slate-900 hover:text-white active:scale-90"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        )}

        {/* Pratinjau Edit Pesan (Editing Box) */}
        {editingMessage && (
            <div className="flex w-full items-center justify-between rounded-xl border border-white/20 border-l-4 border-l-[#facc15] bg-transparent px-4 py-3 text-xs shadow-inner">
                <div className="min-w-0 flex-1 truncate pr-4 text-left">
                    <p className="mb-0.5 font-['Oxanium'] font-bold text-[#facc15]">
                        Mengedit pesan Anda
                    </p>
                    <p className="truncate font-['Oxanium'] text-[11px] text-slate-400">
                        {editingMessage.message}
                    </p>
                </div>
                <button
                    type="button"
                    onClick={onCancelEdit}
                    className="rounded-full p-1 text-slate-400 transition hover:bg-slate-900 hover:text-white active:scale-90"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        )}

        {/* Pratinjau Gambar Sebelum Dikirim */}
        {imagePreview && (
            <div className="flex w-full items-center justify-between gap-2 rounded-xl border border-white/20 bg-transparent p-3">
                <div className="flex min-w-0 items-center gap-3">
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-slate-700 bg-black">
                        <img
                            src={imagePreview}
                            alt="Pratinjau"
                            className="h-full w-full object-cover"
                        />
                    </div>
                    <div className="min-w-0">
                        <p className="truncate text-xs font-semibold text-slate-300">
                            Siap dikirim
                        </p>
                        <p className="truncate text-[10px] text-slate-500">
                            Lampiran gambar
                        </p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={removeImage}
                    className="shrink-0 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-rose-400 transition hover:bg-slate-800 active:scale-95"
                >
                    Batal
                </button>
            </div>
        )}

        {/* Input Row */}
        <div className="flex w-full items-end gap-1.5 sm:gap-2 md:gap-3">
            {/* Tombol Lampirkan File Gambar */}
            {!editingMessage && (
                <>
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl border border-white bg-black/60 text-white transition hover:bg-white/10 active:scale-95"
                    >
                        <Plus className="h-[18px] w-[18px] sm:h-5 sm:w-5" />
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
            <div className="relative flex shrink-0" ref={emojiPickerRef}>
                <button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl border border-white bg-black/60 text-white transition hover:bg-white/10 active:scale-95"
                >
                    <Smile className="h-[18px] w-[18px] sm:h-5 sm:w-5" />
                </button>

                {showEmojiPicker && (
                    <div className="absolute bottom-full left-0 z-50 mb-3 flex max-w-[calc(100vw-1.5rem)] flex-col rounded-xl border border-[#3B28F6]/50 bg-black p-3 shadow-2xl backdrop-blur-md animate-scale-up">
                        <p className="mb-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                            Emoji Picker
                        </p>
                        <div className="grid h-[160px] w-[220px] grid-cols-6 gap-1 overflow-y-auto sm:w-[240px] sm:grid-cols-8">
                            {emojis.map((emoji) => (
                                <button
                                    key={emoji}
                                    type="button"
                                    onClick={() => addEmoji(emoji)}
                                    className="flex h-7 w-7 items-center justify-center rounded text-base transition hover:bg-[#1D215D]/40 active:scale-95"
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
                        if (data.message.trim() || data.attachment) {
                            handleFormSubmit(e as any);
                        }
                    }
                }}
                disabled={processing}
                rows={1}
                className="min-h-[36px] max-h-[100px] flex-1 resize-none overflow-y-auto thin-scrollbar rounded-xl border border-white bg-black/80 px-2.5 py-1.5 text-base text-white placeholder-slate-500 outline-none transition focus:border-white focus:ring-1 focus:ring-white focus:shadow-[0_0_8px_rgba(255,255,255,0.15)] disabled:opacity-50 sm:px-3 sm:py-2 sm:text-sm md:max-h-[150px] md:px-4 md:py-2.5"
            />

            {/* Tombol Kirim */}
            <button
                type="submit"
                disabled={
                    processing ||
                    (!data.message.trim() && !data.attachment)
                }
                className="group relative flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl border border-white bg-black/60 text-white hover:bg-white/10 disabled:pointer-events-none disabled:opacity-30"
            >
                <SendHorizontal className="h-[18px] w-[18px] sm:h-5 sm:w-5" />
            </button>
        </div>
    </form>
);
}
