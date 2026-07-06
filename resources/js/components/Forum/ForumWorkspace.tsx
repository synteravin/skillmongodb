import React, { useEffect, useRef, useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    Send,
    Smile,
    Search,
    User as UserIcon,
    MoreVertical,
    Pin,
    CornerUpLeft,
    X,
    Heart,
    Plus,
    Pencil,
    Trash2,
} from 'lucide-react';
import ConfirmModal from '@/components/ConfirmModal';

interface Sender {
    id: string;
    name: string;
    avatar: string | null;
    role: string;
}

interface Message {
    id: string;
    message: string;
    attachments: string[];
    created_at: string;
    is_pinned: boolean;
    parent: {
        id: string;
        message: string;
        sender_name: string;
    } | null;
    reactions: Array<{
        user_id: string;
        user_name: string;
        emoji: string;
    }>;
    sender: Sender;
}

interface CourseList {
    id: string;
    title: string;
    slug: string;
    thumbnail: string | null;
    last_message: {
        sender_name: string;
        message: string;
        created_at: string;
    } | null;
}

interface SelectedCourse {
    id: string;
    title: string;
    slug: string;
    thumbnail: string | null;
}

interface Props {
    courses: CourseList[];
    selectedCourse: SelectedCourse | null;
    messages: Message[];
    pinnedMessages: Array<{ id: string; message: string; sender_name: string }>;
    auth: {
        user: {
            id: string;
            name: string;
            email: string;
            role: string;
        };
    };
}

export default function ForumWorkspace({
    courses,
    selectedCourse,
    messages,
    pinnedMessages,
    auth,
}: Props) {
    const [localMessages, setLocalMessages] = useState<Message[]>(messages);
    const [searchQuery, setSearchQuery] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // Responsive toggle: set true jika di sub-rute course
    const [showChatMobile, setShowChatMobile] = useState(() => {
        if (typeof window !== 'undefined') {
            const pathParts = window.location.pathname
                .split('/')
                .filter(Boolean);
            return pathParts.length > 2;
        }
        return false;
    });

    // Premium states
    const [replyingTo, setReplyingTo] = useState<Message | null>(null);
    const [editingMessage, setEditingMessage] = useState<Message | null>(null);
    const [activeMenuMessageId, setActiveMenuMessageId] = useState<
        string | null
    >(null);
    const [showReactionPickerId, setShowReactionPickerId] = useState<
        string | null
    >(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [messageIdToDelete, setMessageIdToDelete] = useState<string | null>(
        null,
    );

    const chatEndRef = useRef<HTMLDivElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const emojiPickerRef = useRef<HTMLDivElement | null>(null);
    const messageRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

    // Dynamic base route path
    const basePath = `/${auth.user.role}/forum`;

    const getDashboardRoute = () => {
        if (auth.user.role === 'admin') return '/admin/dashboard';
        if (auth.user.role === 'mentor') return '/mentor/dashboard';
        return '/student/dashboard';
    };

    // Form data
    const { data, setData, post, processing, reset } = useForm<{
        message: string;
        attachment: File | null;
        parent_id: string | null;
    }>({
        message: '',
        attachment: null,
        parent_id: null,
    });

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        setLocalMessages(messages);
        setTimeout(scrollToBottom, 100);
    }, [messages]);

    // Polling real-time ringan
    useEffect(() => {
        if (!selectedCourse) return;

        let isMounted = true;
        const interval = setInterval(() => {
            const lastId =
                localMessages.length > 0
                    ? localMessages[localMessages.length - 1].id
                    : '';
            fetch(
                `${basePath}/${selectedCourse.slug}/messages?after_id=${lastId}`,
            )
                .then((res) => res.json())
                .then((newMessages: Message[]) => {
                    if (isMounted && newMessages.length > 0) {
                        setLocalMessages((prev) => {
                            const prevIds = new Set(prev.map((m) => m.id));
                            const uniqueNew = newMessages.filter(
                                (m) => !prevIds.has(m.id),
                            );
                            if (uniqueNew.length === 0) return prev;
                            const merged = [...prev, ...uniqueNew];
                            setTimeout(scrollToBottom, 50);
                            return merged;
                        });
                    }
                })
                .catch((err) => console.error('Polling error:', err));
        }, 3000);

        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, [selectedCourse, localMessages, basePath]);

    // Klik di luar menu untuk menutup
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                emojiPickerRef.current &&
                !emojiPickerRef.current.contains(event.target as Node)
            ) {
                setShowEmojiPicker(false);
            }
            if (
                activeMenuMessageId &&
                !(event.target as Element).closest('.message-action-menu')
            ) {
                setActiveMenuMessageId(null);
            }
            if (
                showReactionPickerId &&
                !(event.target as Element).closest('.reaction-picker')
            ) {
                setShowReactionPickerId(null);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, [activeMenuMessageId, showReactionPickerId]);

    const filteredCourses = courses.filter((c) =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCourse || processing) return;
        if (!data.message.trim() && !data.attachment) return;

        if (editingMessage) {
            router.put(
                `${basePath}/messages/${editingMessage.id}`,
                {
                    message: data.message,
                },
                {
                    preserveScroll: true,
                    preserveState: true,
                    onSuccess: () => {
                        setEditingMessage(null);
                        setData((prev) => ({ ...prev, message: '' }));
                    },
                    onError: (errors) => {
                        console.error('Gagal mengedit pesan:', errors);
                    },
                },
            );
            return;
        }

        post(`${basePath}/${selectedCourse.slug}/messages`, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                reset();
                setReplyingTo(null);
                setImagePreview(null);
                setTimeout(scrollToBottom, 100);
            },
            onError: (errors) => {
                console.error('Gagal mengirim pesan:', errors);
            },
        });
    };

    const scrollToMessage = (msgId: string) => {
        const el = messageRefs.current[msgId];
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            el.classList.add('bg-[#3B28F6]/10', 'ring-2', 'ring-[#3B28F6]/50');
            setTimeout(() => {
                el.classList.remove(
                    'bg-[#3B28F6]/10',
                    'ring-2',
                    'ring-[#3B28F6]/50',
                );
            }, 2000);
        }
    };

    const quickReactions = ['👍', '❤️', '😂', '😮', '😢', '🙏'];
    const emojis = [
        '😀',
        '😃',
        '😄',
        '😁',
        '😆',
        '😅',
        '😂',
        '🤣',
        '😊',
        '😇',
        '🙂',
        '🙃',
        '😉',
        '😌',
        '😍',
        '🥰',
        '😘',
        '😗',
        '😙',
        '😚',
        '😋',
        '😛',
        '😝',
        '😜',
        '🤪',
        '🧐',
        '😎',
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
        '👍',
        '👎',
        '✊',
        '👊',
        '🤛',
        '🤜',
        '👏',
        '🙌',
        '👐',
        '🤲',
        '🤝',
        '🙏',
        '✍️',
        '💅',
        '🤳',
        '💪',
        '🔥',
        '✨',
        '🎈',
        '🎉',
        '❤️',
    ];

    const addEmoji = (emoji: string) => {
        setData('message', data.message + emoji);
        setShowEmojiPicker(false);
    };

    const handleToggleReaction = (messageId: string, emoji: string) => {
        setLocalMessages((prev) =>
            prev.map((m) => {
                if (m.id === messageId) {
                    const reactions = [...(m.reactions || [])];
                    const foundIndex = reactions.findIndex(
                        (r) => r.user_id === auth.user.id,
                    );
                    if (foundIndex !== -1) {
                        if (reactions[foundIndex].emoji === emoji) {
                            reactions.splice(foundIndex, 1);
                        } else {
                            reactions[foundIndex] = {
                                ...reactions[foundIndex],
                                emoji: emoji,
                            };
                        }
                    } else {
                        reactions.push({
                            user_id: auth.user.id,
                            user_name: auth.user.name,
                            emoji: emoji,
                        });
                    }
                    return { ...m, reactions };
                }
                return m;
            }),
        );
        setActiveMenuMessageId(null);

        router.post(
            `${basePath}/messages/${messageId}/reaction`,
            { emoji },
            {
                preserveState: true,
                preserveScroll: true,
                only: ['messages'],
            },
        );
    };

    const handleTogglePin = (messageId: string) => {
        setLocalMessages((prev) =>
            prev.map((m) => {
                if (m.id === messageId) {
                    return { ...m, is_pinned: !m.is_pinned };
                }
                return m;
            }),
        );
        setActiveMenuMessageId(null);

        router.post(
            `${basePath}/messages/${messageId}/pin`,
            {},
            {
                preserveState: true,
                preserveScroll: true,
                only: ['messages', 'pinnedMessages'],
            },
        );
    };

    const handleReplyTo = (msg: Message) => {
        setReplyingTo(msg);
        setData((prev) => ({ ...prev, parent_id: msg.id }));
        setActiveMenuMessageId(null);
    };

    const cancelReply = () => {
        setReplyingTo(null);
        setData((prev) => ({ ...prev, parent_id: null }));
    };

    const handleStartEdit = (msg: Message) => {
        setEditingMessage(msg);
        setData((prev) => ({ ...prev, message: msg.message }));
        setReplyingTo(null);
        setActiveMenuMessageId(null);
    };

    const cancelEdit = () => {
        setEditingMessage(null);
        setData((prev) => ({ ...prev, message: '' }));
    };

    const handleDeleteMessage = (messageId: string) => {
        setMessageIdToDelete(messageId);
        setDeleteModalOpen(true);
    };

    const confirmDeleteMessage = () => {
        if (!messageIdToDelete) return;
        router.delete(`${basePath}/messages/${messageIdToDelete}`, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setActiveMenuMessageId(null);
                setMessageIdToDelete(null);
            },
            onError: (errors) => {
                console.error('Gagal menghapus pesan:', errors);
            },
        });
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

    const formatTime = (isoString: string) => {
        try {
            const date = new Date(isoString);
            return date.toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
            });
        } catch {
            return '';
        }
    };

    const groupReactions = (reactionsList: Message['reactions']) => {
        const grouped: { [emoji: string]: number } = {};
        (reactionsList || []).forEach((r) => {
            grouped[r.emoji] = (grouped[r.emoji] || 0) + 1;
        });
        return grouped;
    };

    const getNameColor = (name: string) => {
        const colors = [
            'text-[#3B28F6] dark:text-indigo-400',
            'text-emerald-400',
            'text-violet-400',
            'text-sky-400',
            'text-pink-400',
            'text-[#facc15]',
        ];
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        const index = Math.abs(hash) % colors.length;
        return colors[index];
    };

    return (
        <div className="flex h-full w-full overflow-hidden rounded-2xl border border-[#3B28F6]/20 bg-[#020202] text-white shadow-lg">
            {/* ── SIDEBAR CHANNEL (KIRI) ── */}
            <div
                className={`flex w-full shrink-0 flex-col border-r border-[#3B28F6]/20 bg-[#05060f] lg:w-[280px] xl:w-[320px] ${showChatMobile ? 'hidden lg:flex' : 'flex'}`}
            >
                {/* Header Back & Search */}
                <div className="border-b border-[#3B28F6]/20 p-4">
                    <div className="mb-4 flex items-center gap-4">
                        <h1 className="bg-gradient-to-r from-white via-slate-200 to-[#facc15] bg-clip-text font-['Orbitron'] text-sm font-bold tracking-wider text-transparent">
                            FORUM GROUP
                        </h1>
                    </div>

                    <div className="relative">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Cari grup diskusi..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-xl border border-[#3B28F6]/30 bg-black/80 py-2.5 pr-4 pl-10 text-xs text-white placeholder-slate-500 transition outline-none focus:border-[#facc15] focus:ring-1 focus:ring-[#facc15]"
                        />
                    </div>
                </div>

                {/* Course List */}
                <div className="scrollbar-thin scrollbar-thumb-indigo-900 scrollbar-track-transparent flex-1 overflow-y-auto">
                    {filteredCourses.length === 0 ? (
                        <div className="text-slate-550 flex flex-col items-center justify-center p-8 text-center">
                            <p className="text-xs">
                                Tidak ada grup forum yang ditemukan.
                            </p>
                        </div>
                    ) : (
                        filteredCourses.map((group) => {
                            const isActive = selectedCourse?.id === group.id;
                            return (
                                <div
                                    key={group.id}
                                    onClick={() => {
                                        setShowChatMobile(true);
                                        if (!isActive) {
                                            router.visit(
                                                `${basePath}/${group.slug}`,
                                            );
                                        }
                                    }}
                                    className={`flex cursor-pointer items-center gap-3 border-b border-[#3B28F6]/10 px-4 py-4.5 transition-all duration-300 ${
                                        isActive
                                            ? 'border-l-4 border-l-[#facc15] bg-gradient-to-r from-[#3B28F6]/25 to-transparent'
                                            : 'hover:bg-[#1D215D]/10'
                                    }`}
                                >
                                    <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-[#3B28F6]/30 bg-slate-900">
                                        {group.thumbnail ? (
                                            <img
                                                src={group.thumbnail}
                                                alt={group.title}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-indigo-950">
                                                <UserIcon className="h-5 w-5 text-indigo-400" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="mb-1 flex items-center justify-between">
                                            <h3 className="truncate font-['Oxanium'] text-xs leading-none font-semibold text-white">
                                                {group.title}
                                            </h3>
                                            {group.last_message && (
                                                <span className="ml-2 text-[9px] whitespace-nowrap text-slate-500">
                                                    {formatTime(
                                                        group.last_message
                                                            .created_at,
                                                    )}
                                                </span>
                                            )}
                                        </div>
                                        <div className="truncate text-[11px] text-slate-400">
                                            {group.last_message ? (
                                                <>
                                                    <span className="font-semibold text-slate-300">
                                                        {
                                                            group.last_message
                                                                .sender_name
                                                        }
                                                        :
                                                    </span>{' '}
                                                    {group.last_message.message}
                                                </>
                                            ) : (
                                                <span className="text-slate-600 italic">
                                                    Belum ada pesan
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* ── AREA CHAT FEED (KANAN) ── */}
            <div
                className={`flex flex-1 flex-col bg-[#020202] ${!showChatMobile ? 'hidden lg:flex' : 'flex'}`}
            >
                {selectedCourse ? (
                    <>
                        {/* Header Chat */}
                        <div className="z-10 flex h-14 shrink-0 items-center justify-between border-b border-[#3B28F6]/20 bg-[#05060f] px-6 py-4.5">
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowChatMobile(false);
                                        router.visit(basePath);
                                    }}
                                    className="mr-1 rounded-xl border border-[#facc15]/80 bg-black/60 p-2 text-[#facc15] transition hover:border-[#facc15] active:scale-95 lg:hidden"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                </button>
                                <div className="h-10 w-10 overflow-hidden rounded-xl border border-[#3B28F6]/40 bg-slate-900">
                                    {selectedCourse.thumbnail ? (
                                        <img
                                            src={selectedCourse.thumbnail}
                                            alt={selectedCourse.title}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-indigo-950">
                                            <UserIcon className="h-5 w-5 text-indigo-400" />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h2 className="font-['Oxanium'] text-sm leading-none font-bold text-white">
                                        {selectedCourse.title}
                                    </h2>
                                    <p className="mt-1 flex items-center gap-1 text-[10px] leading-none font-semibold text-emerald-400">
                                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400"></span>
                                        Diskusi Aktif
                                    </p>
                                </div>
                            </div>

                            {/* Pinned Messages Board */}
                            {pinnedMessages.length > 0 && (
                                <div className="hidden max-w-sm items-center gap-2 rounded-xl border border-[#facc15]/30 bg-[#facc15]/5 px-3 py-1.5 text-xs text-[#facc15] md:flex">
                                    <Pin className="h-3.5 w-3.5 shrink-0 rotate-45 text-[#facc15]" />
                                    <span className="shrink-0 font-bold">
                                        Pinned:
                                    </span>
                                    <span
                                        onClick={() =>
                                            scrollToMessage(
                                                pinnedMessages[0].id,
                                            )
                                        }
                                        className="cursor-pointer truncate font-medium hover:underline"
                                    >
                                        "{pinnedMessages[0].message}" (
                                        {pinnedMessages[0].sender_name})
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Feed Chat Area */}
                        <div className="flex-1 space-y-4 overflow-y-auto bg-gradient-to-b from-[#020202] to-[#05060f] p-6">
                            {localMessages.length === 0 ? (
                                <div className="flex h-full flex-col items-center justify-center text-slate-500">
                                    <p className="text-sm">
                                        Belum ada percakapan. Mulai obrolan
                                        pertama Anda!
                                    </p>
                                </div>
                            ) : (
                                localMessages.map((msg) => {
                                    const isSelf =
                                        msg.sender.id === auth.user.id;
                                    const reactionsGrouped = groupReactions(
                                        msg.reactions,
                                    );

                                    return (
                                        <div
                                            key={msg.id}
                                            ref={(el) => {
                                                messageRefs.current[msg.id] =
                                                    el;
                                            }}
                                            className={`group relative flex max-w-[90%] gap-3 rounded-2xl transition lg:max-w-[70%] ${isSelf ? 'ml-auto flex-row-reverse' : 'mr-auto'} ${Object.keys(reactionsGrouped).length > 0 ? 'mb-4.5' : ''}`}
                                        >
                                            {/* Avatar */}
                                            {!isSelf && (
                                                <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#3B28F6]/30 bg-slate-900">
                                                    {msg.sender.avatar ? (
                                                        <img
                                                            src={
                                                                msg.sender
                                                                    .avatar
                                                            }
                                                            alt={
                                                                msg.sender.name
                                                            }
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <UserIcon className="h-5 w-5 text-indigo-400" />
                                                    )}
                                                </div>
                                            )}

                                            {/* Bubble Container */}
                                            <div className="relative flex flex-col">
                                                {/* Popover Menu */}
                                                {activeMenuMessageId ===
                                                    msg.id && (
                                                    <div
                                                        onClick={(e) =>
                                                            e.stopPropagation()
                                                        }
                                                        className={`message-action-menu absolute bottom-full z-30 mb-2 flex flex-col rounded-xl border border-[#3B28F6]/50 bg-black/90 p-1.5 shadow-2xl backdrop-blur-md transition ${
                                                            isSelf
                                                                ? 'right-0'
                                                                : 'left-0'
                                                        }`}
                                                        style={{
                                                            minWidth: '180px',
                                                        }}
                                                    >
                                                        {/* Quick Reactions */}
                                                        <div className="mb-1.5 flex items-center justify-between gap-1 border-b border-[#3B28F6]/20 px-1 pb-1.5">
                                                            {quickReactions.map(
                                                                (emoji) => (
                                                                    <button
                                                                        key={
                                                                            emoji
                                                                        }
                                                                        type="button"
                                                                        onClick={() =>
                                                                            handleToggleReaction(
                                                                                msg.id,
                                                                                emoji,
                                                                            )
                                                                        }
                                                                        className="px-1 py-0.5 text-base transition hover:scale-125 active:scale-95"
                                                                    >
                                                                        {emoji}
                                                                    </button>
                                                                ),
                                                            )}
                                                        </div>

                                                        {/* Actions */}
                                                        <div className="flex flex-col text-xs text-slate-200">
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleReplyTo(
                                                                        msg,
                                                                    )
                                                                }
                                                                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left hover:bg-[#3B28F6]/20"
                                                            >
                                                                <CornerUpLeft className="h-3.5 w-3.5" />{' '}
                                                                Balas
                                                            </button>

                                                            {isSelf && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleStartEdit(
                                                                            msg,
                                                                        )
                                                                    }
                                                                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left hover:bg-[#3B28F6]/20"
                                                                >
                                                                    <Pencil className="h-3.5 w-3.5" />{' '}
                                                                    Edit
                                                                </button>
                                                            )}

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleTogglePin(
                                                                        msg.id,
                                                                    )
                                                                }
                                                                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left hover:bg-[#3B28F6]/20"
                                                            >
                                                                <Pin className="h-3.5 w-3.5" />
                                                                {msg.is_pinned
                                                                    ? 'Lepas Semat'
                                                                    : 'Sematkan'}
                                                            </button>

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleDeleteMessage(
                                                                        msg.id,
                                                                    )
                                                                }
                                                                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-red-400 hover:bg-red-500/10"
                                                            >
                                                                <Trash2 className="h-3.5 w-3.5" />{' '}
                                                                Hapus
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Bubble Body */}
                                                <div
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setActiveMenuMessageId(
                                                            activeMenuMessageId ===
                                                                msg.id
                                                                ? null
                                                                : msg.id,
                                                        );
                                                    }}
                                                    className={`relative flex cursor-pointer flex-col rounded-2xl border px-4 py-3 transition select-none active:scale-[0.99] ${
                                                        isSelf
                                                            ? 'rounded-tr-none border-[#3B28F6]/40 bg-[#3B28F6]/20 text-white shadow-[0_0_15px_rgba(59,40,246,0.15)]'
                                                            : 'rounded-tl-none border-[#3b28f6]/10 bg-[#0b0f19] text-slate-100'
                                                    } ${msg.is_pinned ? 'ring-1 ring-[#facc15]/50' : ''} ${Object.keys(reactionsGrouped).length > 0 ? 'pb-5.5' : ''}`}
                                                >
                                                    {/* Quoted Message */}
                                                    {msg.parent && (
                                                        <div
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                scrollToMessage(
                                                                    msg.parent!
                                                                        .id,
                                                                );
                                                            }}
                                                            className={`mb-2 cursor-pointer rounded-r-lg border-l-3 px-3 py-1.5 text-left transition ${
                                                                isSelf
                                                                    ? 'border-white/50 bg-white/10 hover:bg-white/20'
                                                                    : 'border-[#3B28F6] bg-black/45 hover:bg-black/60'
                                                            }`}
                                                        >
                                                            <p
                                                                className={`text-[10px] font-bold ${isSelf ? 'text-white' : 'text-[#facc15]'}`}
                                                            >
                                                                {
                                                                    msg.parent
                                                                        .sender_name
                                                                }
                                                            </p>
                                                            <p className="truncate text-[11px] text-slate-300">
                                                                {
                                                                    msg.parent
                                                                        .message
                                                                }
                                                            </p>
                                                        </div>
                                                    )}

                                                    {/* Sender Details */}
                                                    {!isSelf && (
                                                        <div className="mb-1 flex flex-wrap items-center gap-1.5">
                                                            <span
                                                                className={`font-['Oxanium'] text-xs font-bold ${getNameColor(msg.sender.name)}`}
                                                            >
                                                                {
                                                                    msg.sender
                                                                        .name
                                                                }
                                                            </span>
                                                            {msg.sender.role ===
                                                                'admin' && (
                                                                <span className="rounded border border-rose-500/30 bg-rose-500/20 px-1 py-0.5 text-[8px] font-bold tracking-wider text-rose-400 uppercase">
                                                                    Admin
                                                                </span>
                                                            )}
                                                            {msg.sender.role ===
                                                                'mentor' && (
                                                                <span className="rounded border border-emerald-500/30 bg-emerald-500/20 px-1 py-0.5 text-[8px] font-bold tracking-wider text-emerald-400 uppercase">
                                                                    Mentor
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* Attachment Image */}
                                                    {msg.attachments &&
                                                        msg.attachments.length >
                                                            0 && (
                                                            <div className="mb-2 max-w-full overflow-hidden rounded-lg border border-[#3B28F6]/20 bg-black/40">
                                                                {msg.attachments.map(
                                                                    (
                                                                        url,
                                                                        i,
                                                                    ) => (
                                                                        <img
                                                                            key={
                                                                                i
                                                                            }
                                                                            src={
                                                                                url
                                                                            }
                                                                            alt="Lampiran"
                                                                            className="max-h-[200px] w-full object-cover"
                                                                        />
                                                                    ),
                                                                )}
                                                            </div>
                                                        )}

                                                    {/* Text Message */}
                                                    {msg.message && (
                                                        <p className="text-xs leading-relaxed break-words whitespace-pre-wrap">
                                                            {msg.message}
                                                        </p>
                                                    )}

                                                    {/* Time & Pinned Indicator */}
                                                    <div
                                                        className={`mt-2.5 flex items-center justify-end gap-1 text-[9px] ${isSelf ? 'text-white/60' : 'text-slate-500'}`}
                                                    >
                                                        {msg.is_pinned && (
                                                            <Pin className="h-2.5 w-2.5 rotate-45 text-[#facc15]" />
                                                        )}
                                                        <span>
                                                            {formatTime(
                                                                msg.created_at,
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Floating Reactions */}
                                                {Object.keys(reactionsGrouped)
                                                    .length > 0 && (
                                                    <div
                                                        className={`absolute -bottom-2 z-10 flex cursor-pointer items-center gap-1 rounded-full border border-[#3B28F6]/30 bg-black px-2 py-0.5 text-xs shadow-md transition select-none hover:scale-105 ${
                                                            isSelf
                                                                ? 'right-2'
                                                                : 'left-2'
                                                        }`}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setShowReactionPickerId(
                                                                showReactionPickerId ===
                                                                    msg.id
                                                                    ? null
                                                                    : msg.id,
                                                            );
                                                        }}
                                                    >
                                                        {Object.keys(
                                                            reactionsGrouped,
                                                        )
                                                            .slice(0, 3)
                                                            .map((emoji) => (
                                                                <span
                                                                    key={emoji}
                                                                >
                                                                    {emoji}
                                                                </span>
                                                            ))}
                                                        {Object.keys(
                                                            reactionsGrouped,
                                                        ).length > 1 && (
                                                            <span className="ml-0.5 text-[9px] font-bold text-[#facc15]">
                                                                {Object.values(
                                                                    reactionsGrouped,
                                                                ).reduce(
                                                                    (a, b) =>
                                                                        a + b,
                                                                    0,
                                                                )}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Input Row Container */}
                        <form
                            onSubmit={handleSendMessage}
                            className="relative flex shrink-0 flex-col gap-3.5 border-t border-[#3B28F6]/20 bg-[#05060f] px-6 py-4"
                        >
                            {/* Quoted Message Preview */}
                            {replyingTo && (
                                <div className="flex w-full items-center justify-between rounded-xl border-l-4 border-[#3B28F6] bg-black/60 px-4 py-3 text-xs shadow-inner">
                                    <div className="truncate pr-4 text-left">
                                        <p className="mb-0.5 font-bold text-[#facc15]">
                                            {replyingTo.sender.name}
                                        </p>
                                        <p className="truncate text-[11px] text-slate-400">
                                            {replyingTo.message ??
                                                '[Lampiran Gambar]'}
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={cancelReply}
                                        className="rounded-full p-1 text-slate-400 transition hover:bg-slate-800 hover:text-slate-200 active:scale-90"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            )}

                            {/* Editing Message Preview */}
                            {editingMessage && (
                                <div className="flex w-full items-center justify-between rounded-xl border-l-4 border-[#facc15] bg-[#facc15]/5 px-4 py-3 text-xs shadow-inner">
                                    <div className="truncate pr-4 text-left">
                                        <p className="mb-0.5 font-bold text-[#facc15]">
                                            Mengedit pesan Anda
                                        </p>
                                        <p className="truncate text-[11px] text-slate-400">
                                            {editingMessage.message}
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={cancelEdit}
                                        className="rounded-full p-1 text-slate-400 transition hover:bg-slate-800 hover:text-slate-200 active:scale-90"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            )}

                            {/* Upload Image Preview */}
                            {imagePreview && (
                                <div className="flex w-full items-center justify-between rounded-xl border border-[#3B28F6]/20 bg-black/60 p-3">
                                    <div className="flex items-center gap-3">
                                        <div className="h-14 w-14 overflow-hidden rounded-lg border border-[#3B28F6]/30 bg-slate-900">
                                            <img
                                                src={imagePreview}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-slate-200">
                                                Siap dikirim
                                            </p>
                                            <p className="text-[10px] text-slate-400">
                                                Lampiran gambar
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="rounded-lg border border-[#3B28F6]/30 bg-black px-3 py-1.5 text-xs text-rose-400 transition hover:bg-[#3B28F6]/10 active:scale-95"
                                    >
                                        Batal
                                    </button>
                                </div>
                            )}

                            {/* Input Fields Row */}
                            <div className="flex w-full items-center gap-3">
                                {/* Upload Button */}
                                {!editingMessage && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                fileInputRef.current?.click()
                                            }
                                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#3B28F6]/30 bg-black/60 text-slate-400 transition hover:border-[#facc15] hover:text-[#facc15] active:scale-95"
                                        >
                                            <Plus className="h-5 w-5" />
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

                                {/* Emoji Button */}
                                <div
                                    className="relative flex"
                                    ref={emojiPickerRef}
                                >
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowEmojiPicker(!showEmojiPicker)
                                        }
                                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#3B28F6]/30 bg-black/60 text-slate-400 transition hover:border-[#facc15] hover:text-[#facc15] active:scale-95"
                                    >
                                        <Smile className="h-5 w-5" />
                                    </button>

                                    {showEmojiPicker && (
                                        <div className="absolute bottom-full left-0 z-50 mb-3 flex flex-col rounded-xl border border-[#3B28F6]/50 bg-black p-3 shadow-2xl backdrop-blur-md">
                                            <p className="mb-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                                Emoji Picker
                                            </p>
                                            <div className="grid h-[160px] w-[240px] grid-cols-8 gap-1 overflow-y-auto">
                                                {emojis.map((emoji) => (
                                                    <button
                                                        key={emoji}
                                                        type="button"
                                                        onClick={() =>
                                                            addEmoji(emoji)
                                                        }
                                                        className="flex h-7 w-7 items-center justify-center rounded text-base transition hover:bg-[#3B28F6]/20 active:scale-95"
                                                    >
                                                        {emoji}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Text Input */}
                                <input
                                    type="text"
                                    placeholder="Ketik pesan..."
                                    value={data.message}
                                    onChange={(e) =>
                                        setData('message', e.target.value)
                                    }
                                    disabled={processing}
                                    className="flex-1 rounded-xl border border-[#3B28F6]/30 bg-black/80 px-4 py-2.5 text-xs text-white placeholder-slate-500 transition outline-none focus:border-[#facc15] focus:ring-1 focus:ring-[#facc15] disabled:opacity-50"
                                />

                                {/* Send Button */}
                                <button
                                    type="submit"
                                    disabled={
                                        processing ||
                                        (!data.message.trim() &&
                                            !data.attachment)
                                    }
                                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-[#3B28F6] to-[#4F46E5] text-white shadow-md transition duration-300 hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-30"
                                >
                                    <Send className="h-4 w-4" />
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="text-slate-550 flex h-full flex-col items-center justify-center p-8 text-center">
                        <h3 className="mb-1 font-['Oxanium'] text-sm font-bold text-slate-300">
                            Pilih Obrolan Forum
                        </h3>
                        <p className="max-w-[280px] text-xs text-slate-500">
                            Pilih salah satu grup kursus untuk melihat riwayat
                            diskusi di dalam sistem.
                        </p>
                    </div>
                )}
            </div>

            {/* ConfirmModal for Delete */}
            <ConfirmModal
                open={deleteModalOpen}
                title="Hapus Pesan"
                message="Apakah Anda yakin ingin menghapus pesan ini? Tindakan ini tidak dapat dibatalkan."
                confirmText="Hapus"
                cancelText="Batal"
                variant="danger"
                onConfirm={confirmDeleteMessage}
                onClose={() => {
                    setDeleteModalOpen(false);
                    setMessageIdToDelete(null);
                }}
            />
        </div>
    );
}
