import React from 'react';
import { X, Download, CornerUpLeft, Pencil, Pin, Trash2 } from 'lucide-react';
import { Message } from './types';

interface ImagePreviewModalProps {
    previewImage: { url: string; msg: Message } | null;
    onClose: () => void;
    messages: Message[];
    currentUserId: string;
    isMentorOrAdmin: boolean;
    handleToggleReaction: (messageId: string, emoji: string) => void;
    handleReplyTo: (msg: Message) => void;
    handleStartEdit: (msg: Message) => void;
    handleTogglePin: (messageId: string) => void;
    handleDeleteMessage: (messageId: string) => void;
    quickReactions: string[];
    groupReactions: (reactionsList: Message['reactions']) => {
        [key: string]: {
            count: number;
            users: string[];
            hasReacted: boolean;
        };
    };
}

export default function ImagePreviewModal({
    previewImage,
    onClose,
    messages,
    currentUserId,
    isMentorOrAdmin,
    handleToggleReaction,
    handleReplyTo,
    handleStartEdit,
    handleTogglePin,
    handleDeleteMessage,
    quickReactions,
    groupReactions,
}: ImagePreviewModalProps) {
    if (!previewImage) return null;

    const currentMsg =
        messages.find((m) => m.id === previewImage.msg.id) || previewImage.msg;
    const isSelfImage = currentMsg.sender.id === currentUserId;
    const previewReactions = groupReactions(currentMsg.reactions || []);

    return (
        <div
            className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="animate-scale-up relative flex max-h-[92vh] w-full max-w-3xl flex-col"
            >
                {/* Top bar - ikon polos, tanpa background box */}
                <div className="flex items-center justify-between px-1 pb-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 text-slate-300 transition-colors hover:text-white"
                    >
                        <X className="h-5 w-5" />
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            const a = document.createElement('a');
                            a.href = previewImage.url;
                            a.download =
                                previewImage.url.split('/').pop() || 'lampiran';
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                        }}
                        className="p-2 text-slate-300 transition-colors hover:text-white"
                    >
                        <Download className="h-5 w-5" />
                    </button>
                </div>

                {/* Image - jadi fokus utama, tanpa border/box */}
                <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden">
                    <img
                        src={previewImage.url}
                        alt="Preview"
                        className="max-h-full max-w-full rounded-md object-contain"
                    />
                </div>

                {/* Reaksi - floating row tipis, nempel di atas image, bukan box */}
                <div className="flex items-center justify-center gap-1 py-3">
                    {quickReactions.map((emoji) => {
                        const hasReacted = currentMsg.reactions?.some(
                            (r) =>
                                r.user_id === currentUserId &&
                                r.emoji === emoji,
                        );
                        return (
                            <button
                                key={emoji}
                                type="button"
                                onClick={() =>
                                    handleToggleReaction(currentMsg.id, emoji)
                                }
                                className={`flex h-9 w-9 items-center justify-center rounded-full text-lg transition-colors ${
                                    hasReacted
                                        ? 'bg-slate-800'
                                        : 'hover:bg-slate-800/60'
                                }`}
                            >
                                {emoji}
                            </button>
                        );
                    })}

                    {Object.keys(previewReactions).length > 0 && (
                        <>
                            <div className="mx-1 h-5 w-px bg-slate-700" />
                            {Object.entries(previewReactions).map(
                                ([emoji, data]) => (
                                    <div
                                        key={emoji}
                                        className="flex items-center gap-1 text-xs text-slate-300"
                                        title={data.users.join(', ')}
                                    >
                                        <span>{emoji}</span>
                                        <span>{data.count}</span>
                                    </div>
                                ),
                            )}
                        </>
                    )}
                </div>

                {/* Aksi - ikon + label kecil, sejajar, tanpa background box */}
                <div className="flex items-center justify-center gap-6 pb-2 text-xs text-slate-300">
                    <button
                        type="button"
                        onClick={() => {
                            handleReplyTo(currentMsg);
                            onClose();
                        }}
                        className="flex flex-col items-center gap-1 transition-colors hover:text-white"
                    >
                        <CornerUpLeft className="h-5 w-5" />
                        Balas
                    </button>

                    {isSelfImage && (
                        <button
                            type="button"
                            onClick={() => {
                                handleStartEdit(currentMsg);
                                onClose();
                            }}
                            className="flex flex-col items-center gap-1 transition-colors hover:text-white"
                        >
                            <Pencil className="h-5 w-5" />
                            Edit
                        </button>
                    )}

                    {isMentorOrAdmin && (
                        <button
                            type="button"
                            onClick={() => handleTogglePin(currentMsg.id)}
                            className="flex flex-col items-center gap-1 transition-colors hover:text-white"
                        >
                            <Pin className="h-5 w-5" />
                            {currentMsg.is_pinned ? 'Lepas' : 'Sematkan'}
                        </button>
                    )}

                    {(isSelfImage || isMentorOrAdmin) && (
                        <button
                            type="button"
                            onClick={() => {
                                handleDeleteMessage(currentMsg.id);
                                onClose();
                            }}
                            className="flex flex-col items-center gap-1 text-red-400 transition-colors hover:text-red-300"
                        >
                            <Trash2 className="h-5 w-5" />
                            Hapus
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
