import React from 'react';
import { Pin, CornerUpLeft, Pencil, Trash2, User as UserIcon } from 'lucide-react';
import { Message } from './types';

interface MessageBubbleProps {
    msg: Message;
    currentUserId: string;
    isMentorOrAdmin: boolean;
    isDark: boolean;
    isConsecutive: boolean;
    activeMenuMessageId: string | null;
    setActiveMenuMessageId: (id: string | null) => void;
    showReactionPickerId: string | null;
    setShowReactionPickerId: (id: string | null) => void;
    handleToggleReaction: (messageId: string, emoji: string) => void;
    handleReplyTo: (msg: Message) => void;
    handleStartEdit: (msg: Message) => void;
    handleTogglePin: (messageId: string) => void;
    handleDeleteMessage: (messageId: string) => void;
    handleShowProfile: (userId: string) => void;
    setPreviewImage: (preview: { url: string; msg: Message } | null) => void;
    scrollToMessage: (msgId: string) => void;
    quickReactions: string[];
    domRef?: React.Ref<HTMLDivElement>;
}

const getNameColor = (senderId: string) => {
    const colors = [
        '#FF453A', // Vibrant Red
        '#30D158', // Vibrant Green
        '#FF9F0A', // Vibrant Orange
        '#64D2FF', // Vibrant Sky Blue
        '#BF5AF2', // Vibrant Purple
        '#FFD60A', // Vibrant Yellow
        '#FF375F', // Vibrant Pink
        '#0A84FF', // Vibrant Blue
        '#00C7BE', // Vibrant Teal
        '#5E5CE6', // Vibrant Indigo
        '#E056FD', // Vibrant Magenta
        '#1DD1A1', // Vibrant Turquoise
        '#FECA57', // Vibrant Gold
        '#FF6B6B', // Pastel Red
        '#10AC84', // Dark Teal
        '#54A0FF', // Pastel Blue
    ];
    let hash = 0;
    for (let i = 0; i < senderId.length; i++) {
        hash = senderId.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
};

const formatTime = (isoString: string) => {
    try {
        const date = new Date(isoString);
        return date.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
    } catch {
        return '';
    }
};

export default function MessageBubble({
    msg,
    currentUserId,
    isMentorOrAdmin,
    isDark,
    isConsecutive,
    activeMenuMessageId,
    setActiveMenuMessageId,
    showReactionPickerId,
    setShowReactionPickerId,
    handleToggleReaction,
    handleReplyTo,
    handleStartEdit,
    handleTogglePin,
    handleDeleteMessage,
    handleShowProfile,
    setPreviewImage,
    scrollToMessage,
    quickReactions,
    domRef,
}: MessageBubbleProps) {
    const isSelf = msg.sender.id === currentUserId;
    const isSystem = msg.sender.role === 'system';

    if (isSystem) {
        return (
            <div className="my-2 flex justify-center">
                <span className="rounded-full border border-slate-800 bg-slate-900/80 px-3 py-1 font-['Oxanium'] text-[10px] text-slate-500">
                    {msg.message}
                </span>
            </div>
        );
    }

    // Kelompokkan reaksi berdasarkan jenis emoji
    const groupReactions = (reactionsList: Message['reactions']) => {
        const groups: {
            [key: string]: {
                count: number;
                users: string[];
                hasReacted: boolean;
            };
        } = {};
        (reactionsList || []).forEach((r) => {
            if (!groups[r.emoji]) {
                groups[r.emoji] = { count: 0, users: [], hasReacted: false };
            }
            groups[r.emoji].count += 1;
            groups[r.emoji].users.push(r.user_name);
            if (r.user_id === currentUserId) {
                groups[r.emoji].hasReacted = true;
            }
        });
        return groups;
    };

    const reactionsGrouped = groupReactions(msg.reactions);

    return (
        <div
            ref={domRef}
            className={`group relative flex max-w-[78%] sm:max-w-[82%] md:max-w-[75%] lg:max-w-[70%] gap-2 md:gap-3 rounded-2xl transition-all duration-500 animate-fade-in-slide-up min-w-0 ${
                isSelf ? 'self-end ml-auto flex-row-reverse w-fit' : 'self-start mr-auto w-fit'
            } ${isConsecutive ? 'mt-1' : 'mt-4'} ${
                Object.keys(reactionsGrouped).length > 0 ? 'mb-4.5' : ''
            }`}
        >
            {/* Avatar Pengirim */}
            {!isSelf &&
                (!isConsecutive ? (
                    <div
                        onClick={() => handleShowProfile(msg.sender.id)}
                        className="h-9 w-9 md:h-11 md:w-11 shrink-0 cursor-pointer overflow-hidden rounded-full border-2 border-[#3B28F6] bg-slate-900 transition hover:scale-105"
                    >
                        {msg.sender.avatar ? (
                            <img
                                src={msg.sender.avatar}
                                alt={msg.sender.name}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center bg-[#1D215D]/60 text-slate-200">
                                <UserIcon className="h-4 w-4" />
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="w-9 md:w-11 shrink-0" />
                ))}

            {/* Balon Chat Container */}
            <div className="relative flex flex-col min-w-0">
                {/* ── MENU PILIHAN (Klik Bubble Chat) ── */}
                {activeMenuMessageId === msg.id && (
                    <div
                        onClick={(e) => e.stopPropagation()} // Mencegah tertutupnya menu
                        className={`message-action-menu absolute bottom-full z-30 mb-2 flex scale-100 flex-col rounded-xl border border-[#3B28F6]/40 bg-[#05060f]/95 p-2 shadow-2xl backdrop-blur-md transition-all animate-scale-up ${
                            isSelf ? 'right-0' : 'left-0'
                        }`}
                        style={{
                            minWidth: '180px',
                        }}
                    >
                        {/* Quick Reaction Bar */}
                        <div className="mb-2 flex items-center justify-between gap-1 border-b border-[#3B28F6]/20 pb-2">
                            {quickReactions.map((emoji) => (
                                <button
                                    key={emoji}
                                    type="button"
                                    onClick={() =>
                                        handleToggleReaction(msg.id, emoji)
                                    }
                                    className="px-1.5 py-0.5 text-base transition hover:scale-125 active:scale-95"
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>

                        {/* Actions List */}
                        <div className="flex flex-col font-['Oxanium'] text-xs">
                            <button
                                type="button"
                                onClick={() => handleReplyTo(msg)}
                                className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-slate-300 hover:bg-[#1D215D]/40 hover:text-white"
                            >
                                <CornerUpLeft className="h-3.5 w-3.5" /> Balas
                            </button>

                            {isSelf && (
                                <button
                                    type="button"
                                    onClick={() => handleStartEdit(msg)}
                                    className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-slate-300 hover:bg-[#1D215D]/40 hover:text-white"
                                >
                                    <Pencil className="h-3.5 w-3.5" /> Edit
                                </button>
                            )}

                            {isMentorOrAdmin && (
                                <button
                                    type="button"
                                    onClick={() => handleTogglePin(msg.id)}
                                    className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-slate-300 hover:bg-[#1D215D]/40 hover:text-white"
                                >
                                    <Pin className="h-3.5 w-3.5" />
                                    {msg.is_pinned ? 'Lepas Semat' : 'Sematkan'}
                                </button>
                            )}

                            {(isSelf || isMentorOrAdmin) && (
                                <button
                                    type="button"
                                    onClick={() => handleDeleteMessage(msg.id)}
                                    className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-red-400 hover:bg-red-500/10 hover:text-red-300"
                                >
                                    <Trash2 className="h-3.5 w-3.5" /> Hapus
                                </button>
                            )}
                        </div>
                    </div>
                )}

                <div
                    onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuMessageId(
                            activeMenuMessageId === msg.id ? null : msg.id,
                        );
                    }}
                    style={
                        {
                            '--bubble-bg': isDark ? '#0b0f19' : '#f8fafc',
                        } as React.CSSProperties
                    }
                    className={`chat-bubble-body relative flex cursor-pointer flex-col rounded-[3px] border bg-slate-550 pt-2 pr-[51px] pb-2 pl-[12px] text-slate-800 transition duration-200 select-none active:scale-[0.99] dark:bg-[#0b0f19] dark:text-slate-100 min-w-0 ${
                        isSelf
                            ? `border-[#facc15] bg-[#facc15]/5 shadow-[0_0_8px_rgba(250,204,21,0.15)] ${
                                  isConsecutive ? '' : 'rounded-tr-none'
                              }`
                            : `border-[#3B28F6] bg-[#3B28F6]/5 shadow-[0_0_8px_rgba(59,40,246,0.15)] ${
                                  isConsecutive ? '' : 'rounded-tl-none'
                              }`
                    } ${msg.is_pinned ? 'ring-1 ring-[#facc15]/50' : ''} ${
                        Object.keys(reactionsGrouped).length > 0 ? 'pb-5.5' : ''
                    }`}
                >
                    {/* Top Right Badges Container */}
                    <div className="pointer-events-none absolute top-1 right-1 z-10 flex items-center gap-1 select-none">
                        {msg.is_pinned && (
                            <Pin className="h-3 w-3 rotate-45 text-[#facc15]" />
                        )}
                        {!isSelf && !isConsecutive && msg.sender.role === 'admin' && (
                            <span className="rounded-xs border border-rose-500/30 bg-rose-500/20 px-1 py-[1px] text-[8px] leading-none font-bold tracking-wider text-rose-400 uppercase">
                                Admin
                            </span>
                        )}
                        {!isSelf && !isConsecutive && msg.sender.role === 'mentor' && (
                            <span className="rounded-xs border border-emerald-500/30 bg-emerald-500/20 px-1 py-[1px] text-[8px] leading-none font-bold tracking-wider text-emerald-400 uppercase">
                                Mentor
                            </span>
                        )}
                    </div>

                    {/* Arrow Ekor Balon Chat */}
                    {!isConsecutive &&
                        (isSelf ? (
                            <div
                                className="pointer-events-none absolute top-[12px] right-[-5px] z-10 h-[10px] w-[10px] select-none"
                                style={{
                                    transform: 'rotate(-45deg)',
                                    borderWidth: '0 1px 1px 0',
                                    borderStyle: 'solid',
                                    borderColor: '#facc15',
                                    borderRadius: '0 0 1px 0',
                                    background:
                                        'linear-gradient(-45deg, var(--bubble-bg) 51%, transparent 0)',
                                }}
                            />
                        ) : (
                            <div
                                className="pointer-events-none absolute top-[12px] left-[-6px] z-10 h-[10px] w-[10px] select-none"
                                style={{
                                    transform: 'rotate(-45deg)',
                                    borderWidth: '1px 0 0 1px',
                                    borderStyle: 'solid',
                                    borderColor: '#3B28F6',
                                    borderRadius: '2px 0 0 0',
                                    background:
                                        'linear-gradient(-45deg, transparent 48%, var(--bubble-bg) 0)',
                                }}
                            />
                        ))}

                    {/* Nama & Peran Pengirim */}
                    {!isSelf && !isConsecutive && (
                        <div className="mb-1.5 flex items-center pr-[45px]">
                            <span
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleShowProfile(msg.sender.id);
                                }}
                                className="cursor-pointer font-['Oxanium'] text-xs font-bold hover:underline"
                                style={{
                                    color: getNameColor(msg.sender.id),
                                }}
                            >
                                {msg.sender.name}
                            </span>
                        </div>
                    )}

                    {/* Render Kutipan Pesan (Jika Balasan) */}
                    {msg.parent && (() => {
                        const parentSenderId = msg.parent!.sender_id;
                        const nameColor = parentSenderId
                            ? getNameColor(parentSenderId)
                            : '#3B28F6';
                        const isFullBorder = isSelf;
                        return (
                            <div
                                onClick={(e) => {
                                    e.stopPropagation(); // Mencegah menu terbuka jika mengklik kutipan
                                    scrollToMessage(msg.parent!.id);
                                }}
                                className={`mb-2.5 max-w-[220px] sm:max-w-[280px] md:max-w-[320px] lg:max-w-[380px] cursor-pointer bg-slate-900 text-left transition hover:bg-slate-950 ${
                                    isFullBorder
                                        ? 'border border-[#3B28F6] rounded px-3 py-1.5'
                                        : 'border border-[#3B28F6] rounded-xs py-1 pl-3'
                                }`}
                            >
                                <p
                                    className="font-['Oxanium'] text-[11px] font-extrabold tracking-wide"
                                    style={{ color: nameColor }}
                                >
                                    {msg.parent.sender_name}
                                </p>
                                <p className="line-clamp-2 break-words font-['Oxanium'] text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                                    {msg.parent.message}
                                </p>
                            </div>
                        );
                    })()}

                    {/* Gambar Lampiran */}
                    {msg.attachments && msg.attachments.length > 0 && (
                        <div className="mb-2 max-w-full overflow-hidden rounded-lg border border-[#3B28F6]/20 bg-black/40">
                            {msg.attachments.map((url, i) => (
                                <img
                                    key={i}
                                    src={url}
                                    alt="Lampiran"
                                    className="max-h-[220px] w-full cursor-pointer object-cover transition duration-200 hover:scale-[1.01]"
                                    onClick={(e) => {
                                        e.stopPropagation(); // Mencegah menu terbuka jika mengklik lampiran
                                        setPreviewImage({ url, msg });
                                    }}
                                />
                            ))}
                        </div>
                    )}

                    {/* Teks Pesan */}
                    {msg.message && (
                        <p className="font-['Oxanium'] text-xs leading-relaxed break-words whitespace-pre-wrap text-slate-800 select-text md:text-sm dark:text-slate-100">
                            {msg.message}
                        </p>
                    )}

                    {/* Waktu Kirim */}
                    <span className="absolute right-2.5 bottom-1.5 text-[9px] text-slate-400 uppercase select-none dark:text-slate-500">
                        {formatTime(msg.created_at)}
                    </span>

                    {/* Badges Reaksi Melayang di Pinggir Balon */}
                    {Object.keys(reactionsGrouped).length > 0 && (
                        <div
                            className={`absolute -bottom-2.5 z-10 flex flex-wrap gap-1 ${
                                isSelf ? 'right-2' : 'left-2'
                            }`}
                        >
                            {Object.entries(reactionsGrouped).map(
                                ([emoji, data]) => (
                                    <button
                                        key={emoji}
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleToggleReaction(msg.id, emoji);
                                        }}
                                        title={data.users.join(', ')}
                                        className={`flex items-center gap-0.5 rounded-full px-1.5 py-[3px] text-[11px] leading-none shadow-md shadow-black/30 transition-transform active:scale-90 ${
                                            data.hasReacted
                                                ? 'border border-slate-800 bg-[#1f2c34]'
                                                : 'bg-slate-800 hover:bg-slate-700'
                                        }`}
                                    >
                                        <span className="text-[13px]">{emoji}</span>
                                        {data.count > 1 && (
                                            <span
                                                className={`font-semibold ${
                                                    data.hasReacted
                                                        ? 'text-[#3B28F6]'
                                                        : 'text-slate-300'
                                                }`}
                                            >
                                                {data.count}
                                            </span>
                                        )}
                                    </button>
                                ),
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
