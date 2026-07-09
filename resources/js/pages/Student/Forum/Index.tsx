import { useAppearance } from '@/hooks/use-appearance';
import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    Image as ImageIcon,
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
    Download,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import ConfirmModal from '@/components/ConfirmModal';

interface Sender {
    id: string;
    name: string;
    avatar: string | null;
    role: string;
}

interface Message {
    id: string;
    message: string | null;
    attachments: string[];
    created_at: string;
    sender: Sender;
    parent?: {
        id: string;
        message: string;
        sender_name: string;
    } | null;
    reactions: Array<{
        user_id: string;
        user_name: string;
        emoji: string;
    }>;
    is_pinned?: boolean;
}

interface PinnedMessage {
    id: string;
    message: string;
    sender_name: string;
}

interface CourseGroup {
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

interface User {
    id?: string;
    _id?: string;
    name: string;
    avatar?: string | null;
    role: string;
}

interface Props {
    auth?: {
        user: User;
    };
    user?: User;
    courses: CourseGroup[];
    selectedCourse: {
        id: string;
        title: string;
        slug: string;
        thumbnail: string | null;
    } | null;
    messages: Message[];
    pinnedMessages?: PinnedMessage[];
}

export default function ForumIndex({
    auth,
    user,
    courses = [],
    selectedCourse,
    messages = [],
    pinnedMessages = [],
}: Props) {
    const currentUser = auth?.user || user;
    const currentUserId = currentUser?.id || currentUser?._id || '';
    const isMentorOrAdmin =
        currentUser?.role === 'mentor' || currentUser?.role === 'admin';

    const { resolvedAppearance } = useAppearance();
    const isDark = resolvedAppearance === 'dark';

    const [searchQuery, setSearchQuery] = useState('');
    const [localMessages, setLocalMessages] = useState<Message[]>(messages);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [showChatMobile, setShowChatMobile] = useState(() => {
        if (typeof window !== 'undefined') {
            const pathParts = window.location.pathname.split('/');
            return pathParts.length > 3 && pathParts[3] !== '';
        }
        return false;
    });

    // Fitur Premium States
    const [replyingTo, setReplyingTo] = useState<Message | null>(null);
    const [editingMessage, setEditingMessage] = useState<Message | null>(null);
    const [activeMenuMessageId, setActiveMenuMessageId] = useState<
        string | null
    >(null);
    const [showReactionPickerId, setShowReactionPickerId] = useState<
        string | null
    >(null);

    // Profile Preview Modal states
    const [profileModalOpen, setProfileModalOpen] = useState(false);
    const [profileLoading, setProfileLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState<{
        url: string;
        msg: Message;
    } | null>(null);
    const [selectedProfile, setSelectedProfile] = useState<{
        id: string;
        name: string;
        username: string;
        avatar: string | null;
        role: string;
        level: number;
        rank_name: string | null;
        rank_image: string | null;
        character_name: string | null;
        character_avatar: string | null;
        linkedin: string | null;
        courses: Array<{ name: string; thumbnail: string | null }>;
        erp: number;
    } | null>(null);

    const handleShowProfile = (userId: string) => {
        setProfileLoading(true);
        setProfileModalOpen(true);
        fetch(`/student/forum/user/${userId}/profile`)
            .then((res) => res.json())
            .then((data) => {
                setSelectedProfile(data);
                setProfileLoading(false);
            })
            .catch((err) => {
                console.error('Error fetching user profile:', err);
                setProfileLoading(false);
                setProfileModalOpen(false);
            });
    };
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [messageIdToDelete, setMessageIdToDelete] = useState<string | null>(
        null,
    );

    const chatEndRef = useRef<HTMLDivElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const emojiPickerRef = useRef<HTMLDivElement | null>(null);
    const messageRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

    // Form Inertia untuk posting pesan baru
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

    // Update list pesan lokal saat kursus berubah
    useEffect(() => {
        setLocalMessages(messages);
        setReplyingTo(null);
        setTimeout(scrollToBottom, 100);
    }, [messages]);

    // Polling pesan baru setiap 3 detik
    useEffect(() => {
        if (!selectedCourse) return;

        const interval = setInterval(() => {
            const lastMsg = localMessages[localMessages.length - 1];
            const lastId = lastMsg ? lastMsg.id : '';

            fetch(
                `/student/forum/${selectedCourse.slug}/messages?after_id=${lastId}`,
            )
                .then((res) => {
                    if (res.status === 200) {
                        return res.json();
                    }
                    throw new Error('Gagal memuat pesan baru');
                })
                .then((newMsgs: Message[]) => {
                    if (newMsgs && newMsgs.length > 0) {
                        setLocalMessages((prev) => {
                            const existingIds = new Set(prev.map((m) => m.id));
                            const filteredNew = newMsgs.filter(
                                (m) => !existingIds.has(m.id),
                            );
                            if (filteredNew.length === 0) return prev;
                            return [...prev, ...filteredNew];
                        });
                        setTimeout(scrollToBottom, 50);
                    }
                })
                .catch((err) =>
                    console.error('Error polling forum messages:', err),
                );
        }, 3000);

        return () => clearInterval(interval);
    }, [selectedCourse, localMessages]);

    // Klik di luar picker/menu untuk menutup
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                emojiPickerRef.current &&
                !emojiPickerRef.current.contains(event.target as Node)
            ) {
                setShowEmojiPicker(false);
            }
            // Klik di luar menu pesan untuk menutup
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

    // Filter list course grup di sidebar kiri
    const filteredCourses = courses.filter((c) =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    // Handle kirim pesan
    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCourse || processing) return;
        if (!data.message.trim() && !data.attachment) return;

        if (editingMessage) {
            router.put(
                `/student/forum/messages/${editingMessage.id}`,
                {
                    message: data.message,
                },
                {
                    preserveScroll: true,
                    preserveState: true,
                    onSuccess: () => {
                        setEditingMessage(null);
                        setData((prev) => ({
                            ...prev,
                            message: '',
                        }));
                    },
                    onError: (errors) => {
                        console.error('Gagal mengedit pesan:', errors);
                    },
                },
            );
            return;
        }

        post(`/student/forum/${selectedCourse.slug}/messages`, {
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

    // Fungsi scroll ke pesan spesifik (misal dari kutipan atau pesan tersemat)
    const scrollToMessage = (msgId: string) => {
        const el = messageRefs.current[msgId];
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            const bubble = el.querySelector('.chat-bubble-body');
            if (bubble) {
                bubble.classList.add(
                    'ring-4',
                    'ring-[#facc15]/70',
                    'scale-[1.02]',
                );
                setTimeout(() => {
                    bubble.classList.remove(
                        'ring-4',
                        'ring-[#facc15]/70',
                        'scale-[1.02]',
                    );
                }, 1500);
            }
        }
    };

    // Pilihan emoji cepat & reaksi
    const quickReactions = ['👍', '❤️', '😂', '😮', '😢', '🙏'];
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
    ];

    const addEmoji = (emoji: string) => {
        setData('message', data.message + emoji);
        setShowEmojiPicker(false);
    };

    // API reaksi emoji (Optimistik + Inertia)
    const handleToggleReaction = (messageId: string, emoji: string) => {
        // 1. Optimistic Update untuk reaksi
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

        // 2. Background Inertia Request (Partial Reload)
        router.post(
            `/student/forum/messages/${messageId}/reaction`,
            { emoji },
            {
                preserveState: true,
                preserveScroll: true,
                only: ['messages'],
            },
        );
    };

    // API sematkan (pin) pesan (Optimistik + Inertia)
    const handleTogglePin = (messageId: string) => {
        // 1. Optimistic Update untuk pin
        setLocalMessages((prev) =>
            prev.map((m) => {
                if (m.id === messageId) {
                    return { ...m, is_pinned: !m.is_pinned };
                }
                return m;
            }),
        );
        setActiveMenuMessageId(null);

        // 2. Background Inertia Request (Partial Reload)
        router.post(
            `/student/forum/messages/${messageId}/pin`,
            {},
            {
                preserveState: true,
                preserveScroll: true,
                only: ['messages', 'pinnedMessages'],
            },
        );
    };

    // Set replying to state
    const handleReplyTo = (msg: Message) => {
        setReplyingTo(msg);
        setData((prev) => ({
            ...prev,
            parent_id: msg.id,
        }));
        setActiveMenuMessageId(null);
    };

    const cancelReply = () => {
        setReplyingTo(null);
        setData((prev) => ({
            ...prev,
            parent_id: null,
        }));
    };

    const handleStartEdit = (msg: Message) => {
        setEditingMessage(msg);
        setData((prev) => ({
            ...prev,
            message: msg.message,
        }));
        setReplyingTo(null); // Batalkan balas jika sedang membalas
        setActiveMenuMessageId(null);
    };

    const cancelEdit = () => {
        setEditingMessage(null);
        setData((prev) => ({
            ...prev,
            message: '',
        }));
    };

    const handleDeleteMessage = (messageId: string) => {
        setMessageIdToDelete(messageId);
        setDeleteModalOpen(true);
    };

    const confirmDeleteMessage = () => {
        if (!messageIdToDelete) return;
        router.delete(`/student/forum/messages/${messageIdToDelete}`, {
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

    // Handle unggah foto
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

    // Format jam pesan
    const formatTime = (isoString: string) => {
        const date = new Date(isoString);
        return date.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
    };

    // Format tanggal pembagi
    const formatHeaderDate = (isoString: string) => {
        const date = new Date(isoString);
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Hari Ini';
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Kemarin';
        } else {
            return date.toLocaleDateString('id-ID', {
                day: '2-digit',
                month: '2-digit',
                year: '2-digit',
            });
        }
    };

    // List warna acak untuk nama pengirim lain agar bervariasi (seperti WhatsApp)
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

    // Kelompokkan reaksi berdasarkan jenis emoji
    const groupReactions = (reactionsList: Message['reactions']) => {
        const groups: {
            [key: string]: {
                count: number;
                users: string[];
                hasReacted: boolean;
            };
        } = {};
        reactionsList.forEach((r) => {
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

    return (
        <>
            <Head
                title={`Forum - ${selectedCourse ? selectedCourse.title : 'Diskusi'}`}
            />

            <div className="flex h-screen w-screen overflow-hidden bg-[#121212] text-white">
                {/* ── SIDEBAR KIRI ── */}
                <div
                    className={`flex w-full shrink-0 flex-col border-r border-[#3B28F6]/20 bg-[#121212] md:w-[350px] lg:w-[400px] ${showChatMobile ? 'hidden md:flex' : 'flex'}`}
                >
                    {/* Header Sidebar: Tombol Back & Kolom Pencarian */}
                    <div className="border-b border-[#3B28F6]/20 p-4">
                        <div className="mb-4 flex items-center gap-3 sm:gap-6">
                            <div className="group relative shrink-0 cursor-pointer">
                                <svg
                                    className="h-[36px] w-[80px] overflow-visible sm:h-[49px] sm:w-[110px]"
                                    viewBox="0 0 110 46"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <defs>
                                        <linearGradient
                                            id="back_border_grad_lb"
                                            x1="0%"
                                            y1="0%"
                                            x2="100%"
                                            y2="0%"
                                        >
                                            <stop
                                                offset="0%"
                                                stopColor="#3B28F6"
                                            />
                                            <stop
                                                offset="100%"
                                                stopColor="#FACC15"
                                            />
                                        </linearGradient>
                                    </defs>
                                    <path
                                        d="M 3,3 H 127 L 97,47 H 3 Z"
                                        className="fill-blue-50/60 transition-colors dark:fill-[#080e28]/40"
                                        stroke="url(#back_border_grad_lb)"
                                        strokeWidth="2"
                                        strokeLinejoin="miter"
                                        style={{
                                            filter: 'drop-shadow(0 0 3px rgba(59, 130, 246, 0.35))',
                                        }}
                                    />
                                </svg>

                                <Link
                                    href="/student/dashboard"
                                    className="absolute inset-0 flex items-center justify-center text-[#1e3a8a] dark:text-blue-200"
                                >
                                    <svg
                                        className="h-8 w-8 sm:h-11 sm:w-11"
                                        viewBox="0 0 44 44"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M 6 17 L 13 10 M 6 17 L 13 24" />
                                        <path d="M 9 17 H 36 C 42 19 43 30 32 30 H 15" />
                                    </svg>
                                </Link>
                            </div>

                            <h1 className="text-md font-['Orbitron'] font-extrabold tracking-[0.05em] whitespace-nowrap text-[#1e3a8a] uppercase transition-colors duration-500 sm:text-xl sm:tracking-[0.1em] md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-lg dark:text-[#F0F0F0]">
                                Forum Group
                            </h1>
                        </div>

                        {/* Input Pencarian */}
                        <div className="relative">
                            <Search className="absolute top-1/2 left-3 z-10 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Cari grup diskusi..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full rounded-xl border-[1px] border-transparent bg-transparent py-2.5 pr-4 pl-10 text-sm text-white placeholder-slate-500 transition outline-none focus:ring-1 focus:ring-[#facc15]"
                                style={{
                                    backgroundImage:
                                        'linear-gradient(#121212, #121212), linear-gradient(to bottom, #3B28F6 0%, #4c2fff 30%, #7c3aed 50%, #facc15 100%)',
                                    backgroundOrigin: 'border-box',
                                    backgroundClip: 'padding-box, border-box',
                                    backgroundColor: 'transparent',
                                }}
                            />
                        </div>
                    </div>

                    {/* Daftar Kursus / Grup */}
                    <div className="scrollbar-thin scrollbar-thumb-indigo-900 scrollbar-track-transparent flex-1 overflow-y-auto">
                        {filteredCourses.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-8 text-center text-slate-500">
                                <p className="text-sm">
                                    Tidak ada grup forum yang ditemukan.
                                </p>
                            </div>
                        ) : (
                            filteredCourses.map((group) => {
                                const isActive =
                                    selectedCourse?.id === group.id;
                                return (
                                    <div
                                        key={group.id}
                                        onClick={() => {
                                            setShowChatMobile(true);
                                            if (!isActive) {
                                                router.visit(
                                                    `/student/forum/${group.slug}`,
                                                );
                                            }
                                        }}
                                        className={`flex cursor-pointer items-center gap-3 rounded-lg border-1 border-white px-4 py-3 transition-colors duration-200 ${
                                            isActive
                                                ? 'bg-[#3B28F6]/15'
                                                : 'bg-[#121212] hover:bg-white/5'
                                        }`}
                                    >
                                        {/* Avatar Kursus */}
                                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-white bg-slate-900">
                                            {group.thumbnail ? (
                                                <img
                                                    src={group.thumbnail}
                                                    alt={group.title}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center bg-indigo-950">
                                                    <UserIcon className="h-6 w-6 text-indigo-400" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Info & Cuplikan Chat */}
                                        <div className="min-w-0 flex-1">
                                            <div className="mb-1 flex items-center justify-between">
                                                <h3 className="truncate font-['Oxanium'] text-sm leading-none font-semibold text-white">
                                                    {group.title}
                                                </h3>
                                                {group.last_message && (
                                                    <span className="ml-2 shrink-0 text-[10px] whitespace-nowrap text-slate-500">
                                                        {formatTime(
                                                            group.last_message
                                                                .created_at,
                                                        )}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="truncate text-xs text-slate-400">
                                                {group.last_message ? (
                                                    <>
                                                        <span className="font-semibold text-slate-300">
                                                            {
                                                                group
                                                                    .last_message
                                                                    .sender_name
                                                            }
                                                            :
                                                        </span>{' '}
                                                        {
                                                            group.last_message
                                                                .message
                                                        }
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

                {/* ── AREA CHAT UTAMA (KANAN) ── */}
                <div
                    className={`flex flex-1 flex-col bg-[#121212] ${showChatMobile ? 'flex' : 'hidden md:flex'}`}
                >
                    {selectedCourse ? (
                        <>
                            {/* Header Chat */}
                            <div className="relative z-10 shrink-0">
                                <div
                                    className="p-[1px]"
                                    style={{
                                        background:
                                            'linear-gradient(to bottom, #3B28F6 0%, #7c3aed 50%, #facc15 100%)',
                                    }}
                                >
                                    <div className="flex items-center justify-between bg-[#121212] px-6 py-4.5">
                                        <div className="flex items-center gap-3">
                                            {/* Tombol Back Mobile */}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowChatMobile(false)
                                                }
                                                className="mr-1 rounded-xl border border-[#facc15]/80 bg-black/60 p-2 text-[#facc15] transition hover:border-[#facc15] active:scale-95 md:hidden"
                                            >
                                                <ArrowLeft className="h-4 w-4" />
                                            </button>

                                            <div className="h-10 w-10 overflow-hidden rounded-xl border border-[#3B28F6]/40 bg-slate-900">
                                                {selectedCourse.thumbnail ? (
                                                    <img
                                                        src={
                                                            selectedCourse.thumbnail
                                                        }
                                                        alt={
                                                            selectedCourse.title
                                                        }
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center bg-indigo-950">
                                                        <UserIcon className="h-5 w-5 text-indigo-400" />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <h2 className="font-['Orbitron'] text-sm font-bold tracking-wide text-white md:text-base">
                                                    {selectedCourse.title}
                                                </h2>
                                                <p className="text-[10px] text-[#facc15]">
                                                    Diskusi Kelas Aktif
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Sticky Bar untuk Pesan Tersemat (Pinned Messages) */}
                            {pinnedMessages.length > 0 && (
                                <div className="z-10 flex shrink-0 items-center justify-between border-b border-[#facc15]/20 bg-[#121212] px-6 py-2.5 font-['Oxanium'] text-xs text-slate-300">
                                    <div
                                        className="flex flex-1 cursor-pointer items-center gap-2 truncate hover:text-white"
                                        onClick={() =>
                                            scrollToMessage(
                                                pinnedMessages[
                                                    pinnedMessages.length - 1
                                                ].id,
                                            )
                                        }
                                    >
                                        <Pin className="h-3.5 w-3.5 shrink-0 rotate-45 text-[#facc15]" />
                                        <span className="shrink-0 font-bold text-[#facc15]">
                                            Sematkan:
                                        </span>
                                        <span className="truncate italic">
                                            "
                                            {
                                                pinnedMessages[
                                                    pinnedMessages.length - 1
                                                ].message
                                            }
                                            "
                                        </span>
                                    </div>
                                    <span className="ml-4 shrink-0 font-['Orbitron'] text-[10px] text-slate-500">
                                        Oleh{' '}
                                        {
                                            pinnedMessages[
                                                pinnedMessages.length - 1
                                            ].sender_name
                                        }
                                    </span>
                                </div>
                            )}

                            {/* Feed Diskusi / Chat Area */}
                            <div className="bg-radial-gradient flex-1 overflow-y-auto from-indigo-950/5 via-transparent to-transparent px-6 py-6">
                                {localMessages.length === 0 ? (
                                    <div className="flex h-full flex-col items-center justify-center text-center text-slate-500">
                                        <div className="mb-2 rounded-full bg-slate-900/50 p-4">
                                            <Smile className="h-8 w-8 text-[#facc15]" />
                                        </div>
                                        <h4 className="text-sm font-semibold text-slate-400">
                                            Belum ada pesan di forum ini
                                        </h4>
                                        <p className="mt-1 max-w-[280px] text-xs text-slate-500">
                                            Mulai obrolan baru dengan
                                            mengirimkan pertanyaan atau
                                            tanggapan Anda di bawah.
                                        </p>
                                    </div>
                                ) : (
                                    localMessages.map((msg, index) => {
                                        const isSelf =
                                            msg.sender.id === currentUserId;
                                        const isSystem =
                                            msg.sender.role === 'system';
                                        const isConsecutive = (() => {
                                            if (index === 0) return false;
                                            const prevMsg =
                                                localMessages[index - 1];
                                            if (
                                                prevMsg.sender.role === 'system'
                                            )
                                                return false;
                                            if (
                                                prevMsg.sender.id !==
                                                msg.sender.id
                                            )
                                                return false;
                                            try {
                                                const timeDiff =
                                                    new Date(
                                                        msg.created_at,
                                                    ).getTime() -
                                                    new Date(
                                                        prevMsg.created_at,
                                                    ).getTime();
                                                if (timeDiff > 5 * 60 * 1000)
                                                    return false;
                                            } catch (e) {}
                                            return true;
                                        })();

                                        // Cek apakah tanggal berbeda dari pesan sebelumnya untuk pembagi hari
                                        const showDateDivider =
                                            index === 0 ||
                                            new Date(
                                                localMessages[index - 1]
                                                    .created_at,
                                            ).toDateString() !==
                                                new Date(
                                                    msg.created_at,
                                                ).toDateString();

                                        if (isSystem) {
                                            return (
                                                <div
                                                    key={msg.id}
                                                    className="my-2 flex justify-center"
                                                >
                                                    <span className="rounded-full border border-slate-800 bg-slate-900/80 px-3 py-1 font-['Oxanium'] text-[10px] text-slate-500">
                                                        {msg.message}
                                                    </span>
                                                </div>
                                            );
                                        }

                                        const reactionsGrouped = groupReactions(
                                            msg.reactions,
                                        );

                                        return (
                                            <React.Fragment key={msg.id}>
                                                {showDateDivider && (
                                                    <div className="my-4 flex justify-center">
                                                        <span className="rounded-md border border-[#3B28F6]/10 bg-slate-950/80 px-3 py-1 font-['Orbitron'] text-[10px] font-bold tracking-wider text-[#facc15] uppercase">
                                                            {formatHeaderDate(
                                                                msg.created_at,
                                                            )}
                                                        </span>
                                                    </div>
                                                )}

                                                <div
                                                    ref={(el) => {
                                                        messageRefs.current[
                                                            msg.id
                                                        ] = el;
                                                    }}
                                                    className={`group relative flex max-w-[85%] gap-3 rounded-2xl transition-all duration-500 md:max-w-[70%] ${isSelf ? 'ml-auto flex-row-reverse' : 'mr-auto'} ${isConsecutive ? 'mt-1' : index === 0 ? 'mt-0' : 'mt-4'} ${Object.keys(reactionsGrouped).length > 0 ? 'mb-4.5' : ''}`}
                                                >
                                                    {/* Avatar Pengirim */}
                                                    {!isSelf &&
                                                        (!isConsecutive ? (
                                                            <div
                                                                onClick={() =>
                                                                    handleShowProfile(
                                                                        msg
                                                                            .sender
                                                                            .id,
                                                                    )
                                                                }
                                                                className="h-11 w-11 shrink-0 cursor-pointer overflow-hidden rounded-full border-2 border-[#3B28F6] bg-slate-900 transition hover:scale-105"
                                                            >
                                                                {msg.sender
                                                                    .avatar ? (
                                                                    <img
                                                                        src={
                                                                            msg
                                                                                .sender
                                                                                .avatar
                                                                        }
                                                                        alt={
                                                                            msg
                                                                                .sender
                                                                                .name
                                                                        }
                                                                        className="h-full w-full object-cover"
                                                                    />
                                                                ) : (
                                                                    <div className="flex h-full w-full items-center justify-center bg-[#1D215D]/60 text-slate-200">
                                                                        <UserIcon className="h-4 w-4" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <div className="w-11 shrink-0" />
                                                        ))}

                                                    {/* Balon Chat Container */}
                                                <div className="relative flex flex-col">
                                                    {/* ── MENU PILIHAN (Klik Bubble Chat) ── */}
                                                    {activeMenuMessageId === msg.id && (
                                                        <div
                                                            onClick={(e) => e.stopPropagation()} // Mencegah tertutupnya menu
                                                            className={`message-action-menu absolute bottom-full z-30 mb-2 flex scale-100 flex-col rounded-xl border border-[#3B28F6]/40 bg-[#05060f]/95 p-2 shadow-2xl backdrop-blur-md transition-all ${
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
                                                                        onClick={() => handleToggleReaction(msg.id, emoji)}
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
                                                        className={`chat-bubble-body relative flex cursor-pointer flex-col rounded-[3px] border bg-slate-50 pt-2 pr-[51px] pb-2 pl-[12px] text-slate-800 transition duration-200 select-none active:scale-[0.99] dark:bg-[#0b0f19] dark:text-slate-100 ${
                                                            isSelf
                                                                ? `border-[#facc15] shadow-[0_0_8px_rgba(250,204,21,0.15)] ${isConsecutive ? '' : 'rounded-tr-none'}`
                                                                : `border-[#3B28F6] shadow-[0_0_8px_rgba(59,40,246,0.15)] ${isConsecutive ? '' : 'rounded-tl-none'}`
                                                        } ${msg.is_pinned ? 'ring-1 ring-[#facc15]/50' : ''} ${Object.keys(reactionsGrouped).length > 0 ? 'pb-5.5' : ''}`}
                                                    >
                                                        {/* Top Right Badges Container */}
                                                        <div className="pointer-events-none absolute top-1.5 right-1.5 z-10 flex items-center gap-1 select-none">
                                                            {msg.is_pinned && (
                                                                <Pin className="h-3 w-3 rotate-45 text-[#facc15]" />
                                                            )}
                                                            {!isSelf && !isConsecutive && msg.sender.role === 'admin' && (
                                                                <span className="rounded-sm border border-rose-500/30 bg-rose-500/20 px-1 py-[1px] text-[8px] leading-none font-bold tracking-wider text-rose-400 uppercase">
                                                                    Admin
                                                                </span>
                                                            )}
                                                            {!isSelf && !isConsecutive && msg.sender.role === 'mentor' && (
                                                                <span className="rounded-sm border border-emerald-500/30 bg-emerald-500/20 px-1 py-[1px] text-[8px] leading-none font-bold tracking-wider text-emerald-400 uppercase">
                                                                    Mentor
                                                                </span>
                                                            )}
                                                        </div>

                                                        {/* Arrow Ekor Balon Chat — teknik Result A: border-radius di ujung lancip biar rapi */}
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
                                                        {msg.parent && (
                                                            <div
                                                                onClick={(e) => {
                                                                    e.stopPropagation(); // Mencegah menu terbuka jika mengklik kutipan
                                                                    scrollToMessage(msg.parent!.id);
                                                                }}
                                                                className={`mt-[-8px] mr-[-55px] mb-3 ml-[-14px] cursor-pointer border-l-[3px] border-[#3B28F6] bg-transparent py-1.5 pr-[55px] pl-[11px] text-left transition hover:bg-white/5 ${
                                                                    isConsecutive
                                                                        ? 'rounded-t-[6px]'
                                                                        : isSelf
                                                                            ? 'rounded-tl-[6px] rounded-tr-none'
                                                                            : 'rounded-tl-none rounded-tr-[6px]'
                                                                }`}
                                                            >
                                                                <p className="font-['Oxanium'] text-[11px] font-extrabold text-[#3B28F6] dark:text-[#facc15] tracking-wide">
                                                                    {msg.parent.sender_name}
                                                                </p>
                                                                <p className="truncate font-['Oxanium'] text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                                                                    {msg.parent.message}
                                                                </p>
                                                            </div>
                                                        )}

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

                                                        {/* Badges Reaksi Melayang di Pinggir Balon - Gaya WhatsApp */}
                                                        {Object.keys(reactionsGrouped).length > 0 && (
                                                            <div
                                                                className={`absolute -bottom-2.5 z-10 flex flex-wrap gap-1 ${isSelf ? 'right-2' : 'left-2'}`}
                                                            >
                                                                {Object.entries(reactionsGrouped).map(([emoji, data]) => (
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
                                                                                className={`font-semibold ${data.hasReacted ? 'text-[#3B28F6]' : 'text-slate-300'}`}
                                                                            >
                                                                                {data.count}
                                                                            </span>
                                                                        )}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                </div>
                                            </React.Fragment>
                                        );
                                    })
                                )}
                                <div ref={chatEndRef} />
                            </div>

                            {/* Baris Input & Kontrol Pengiriman (Konsolidasi Ala WhatsApp) */}
                            <form
                                onSubmit={handleSendMessage}
                                className="relative flex shrink-0 flex-col gap-3.5 border-t border-white/20 bg-[#121212] px-6 py-4"
                            >
                                {/* Pratinjau Balasan Pesan (Quoted Preview Box) */}
                                {replyingTo && (
                                    <div className="flex w-full items-center justify-between rounded-xl border border-white/20 border-l-4 border-l-[#3B28F6] bg-transparent px-4 py-3 text-xs shadow-inner">
                                        <div className="truncate pr-4 text-left">
                                            <p className="mb-0.5 font-['Oxanium'] font-bold text-[#facc15]">
                                                {replyingTo.sender.name}
                                            </p>
                                            <p className="truncate font-['Oxanium'] text-[11px] text-slate-400">
                                                {replyingTo.message ??
                                                    '[Lampiran Gambar]'}
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={cancelReply}
                                            className="rounded-full p-1 text-slate-400 transition hover:bg-slate-900 hover:text-white active:scale-90"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                )}

                                {/* Pratinjau Edit Pesan (Editing Box) */}
                                {editingMessage && (
                                    <div className="flex w-full items-center justify-between rounded-xl border border-white/20 border-l-4 border-l-[#facc15] bg-transparent px-4 py-3 text-xs shadow-inner">
                                        <div className="truncate pr-4 text-left">
                                            <p className="mb-0.5 font-['Oxanium'] font-bold text-[#facc15]">
                                                Mengedit pesan Anda
                                            </p>
                                            <p className="truncate font-['Oxanium'] text-[11px] text-slate-400">
                                                {editingMessage.message}
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={cancelEdit}
                                            className="rounded-full p-1 text-slate-400 transition hover:bg-slate-900 hover:text-white active:scale-90"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                )}

                                {/* Pratinjau Gambar Sebelum Dikirim */}
                                {imagePreview && (
                                    <div className="flex w-full items-center justify-between rounded-xl border border-white/20 bg-transparent p-3">
                                        <div className="flex items-center gap-3">
                                            <div className="h-14 w-14 overflow-hidden rounded-lg border border-slate-700 bg-black">
                                                <img
                                                    src={imagePreview}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-slate-300">
                                                    Siap dikirim
                                                </p>
                                                <p className="text-[10px] text-slate-500">
                                                    Lampiran gambar
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-rose-400 transition hover:bg-slate-800 active:scale-95"
                                        >
                                            Batal
                                        </button>
                                    </div>
                                )}

                                {/* Input Row */}
                                <div className="flex w-full items-center gap-3">
                                    {/* Tombol Lampirkan File Gambar */}
                                    {!editingMessage && (
                                        <>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    fileInputRef.current?.click()
                                                }
                                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white bg-black/60 text-white transition hover:bg-white/10 active:scale-95"
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

                                    {/* Tombol Emoji */}
                                    <div
                                        className="relative flex"
                                        ref={emojiPickerRef}
                                    >
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowEmojiPicker(
                                                    !showEmojiPicker,
                                                )
                                            }
                                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white bg-black/60 text-white transition hover:bg-white/10 active:scale-95"
                                        >
                                            <Smile className="h-5 w-5" />
                                        </button>

                                        {showEmojiPicker && (
                                            <div className="absolute bottom-12 left-0 z-50 grid w-[190px] grid-cols-5 gap-2 rounded-xl border border-white/20 bg-[#121212] p-3 shadow-xl">
                                                {emojis.map((emoji) => (
                                                    <button
                                                        key={emoji}
                                                        type="button"
                                                        onClick={() =>
                                                            addEmoji(emoji)
                                                        }
                                                        className="flex h-7 w-7 items-center justify-center rounded text-base transition hover:bg-[#1D215D]/40 active:scale-95"
                                                    >
                                                        {emoji}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Kotak Teks Input Pesan */}
                                    <input
                                        type="text"
                                        placeholder="Ketik pesan..."
                                        value={data.message}
                                        onChange={(e) =>
                                            setData('message', e.target.value)
                                        }
                                        disabled={processing}
                                        className="flex-1 rounded-xl border border-white bg-black/80 px-4 py-2.5 text-sm text-white placeholder-slate-500 transition outline-none focus:border-white focus:ring-1 focus:ring-white focus:shadow-[0_0_8px_rgba(255,255,255,0.15)] disabled:opacity-50"
                                    />

                                    {/* Tombol Kirim */}
                                    <button
                                        type="submit"
                                        disabled={
                                            processing ||
                                            (!data.message.trim() &&
                                                !data.attachment)
                                        }
                                        className="group relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white bg-black/60 text-white transition duration-300 hover:-translate-y-0.5 hover:bg-white/10 disabled:pointer-events-none disabled:opacity-30"
                                    >
                                        <Send className="h-5 w-5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                    </button>
                                </div>
                            </form>
                        </>
                    ) : (
                        <div className="flex h-full flex-col items-center justify-center p-8 text-center text-slate-500">
                            <h3 className="mb-1 font-['Orbitron'] text-base font-bold text-slate-400">
                                Pilih Obrolan Forum
                            </h3>
                            <p className="max-w-[280px] text-xs text-slate-500">
                                Grup chat akan ditampilkan berdasarkan daftar
                                kelas/kursus yang Anda ikuti.
                            </p>
                        </div>
                    )}
                </div>
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

                {/* User Profile Modal */}
                {profileModalOpen && (
                    <div
                        className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                        onClick={() => {
                            setProfileModalOpen(false);
                            setSelectedProfile(null);
                        }}
                    >
                        <div
                            onClick={(e) => e.stopPropagation()}
                            className="relative w-full max-w-[340px] overflow-hidden rounded-3xl border border-[#3b28f6]/30 bg-black/40 p-5 text-white shadow-[0_0_50px_rgba(59,40,246,0.25)] backdrop-blur-sm"
                        >
                            {/* Close button */}
                            <button
                                type="button"
                                onClick={() => {
                                    setProfileModalOpen(false);
                                    setSelectedProfile(null);
                                }}
                                className="absolute top-4 right-4 z-10 rounded-full p-1 text-slate-400 transition hover:bg-slate-800/50 hover:text-white"
                            >
                                <X className="h-4 w-4" />
                            </button>

                            {profileLoading ? (
                                <div className="flex flex-col items-center justify-center py-12">
                                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#facc15] border-t-transparent"></div>
                                    <p className="mt-4 font-['Oxanium'] text-xs text-slate-400">
                                        Memuat profil...
                                    </p>
                                </div>
                            ) : selectedProfile ? (
                                <div className="flex flex-col">
                                    {/* Top Section: Two columns (Avatar & Level) */}
                                    <div className="mb-5 grid grid-cols-[120px_1fr] items-center gap-4">
                                        {/* Left: Square avatar with slightly rounded corners */}
                                        <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-[#3b28f6]/20 bg-slate-900 shadow-[0_4px_20px_rgba(59,40,246,0.15)]">
                                            {selectedProfile.avatar ? (
                                                <img
                                                    src={selectedProfile.avatar}
                                                    alt={selectedProfile.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center bg-indigo-950/40">
                                                    <UserIcon className="h-10 w-10 text-indigo-400" />
                                                </div>
                                            )}
                                            {/* Role Badge */}
                                            <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 rounded-full border border-[#facc15]/30 bg-black/80 px-2 py-0.5 font-['Oxanium'] text-[8px] font-bold tracking-wider text-[#facc15] uppercase">
                                                {selectedProfile.role}
                                            </div>
                                        </div>

                                        {/* Right: Username & Level Circle */}
                                        <div className="flex flex-col items-center justify-center">
                                            <h3
                                                className="mb-3 w-full truncate text-center font-['Oxanium'] text-sm leading-tight font-bold text-white"
                                                title={selectedProfile.name}
                                            >
                                                {selectedProfile.name}
                                            </h3>

                                            {/* Circle Level */}
                                            <div className="relative flex h-18 w-18 flex-col items-center justify-center rounded-full border-4 border-indigo-700/80 bg-black/60 shadow-[0_0_15px_rgba(59,40,246,0.5)]">
                                                <span className="font-['Orbitron'] text-xl font-black text-white">
                                                    {selectedProfile.level}
                                                </span>
                                                {/* Subtitle label */}
                                                <span className="-mt-0.5 font-['Oxanium'] text-[7px] font-bold tracking-widest text-[#facc15] uppercase">
                                                    LEVEL
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Divider */}
                                    <div className="mb-4 w-full border-t border-[#3b28f6]/10"></div>

                                    {/* Content Rows */}
                                    <div className="flex flex-col gap-3.5">
                                        {/* Row 1: ERP & Rank Badge */}
                                        <div className="flex items-center justify-between rounded-2xl border border-[#3b28f6]/10 bg-black/30 px-4 py-3 shadow-inner">
                                            <div className="flex flex-col">
                                                <span className="font-['Oxanium'] text-xs font-bold tracking-wider text-slate-400">
                                                    ERP
                                                </span>
                                                <span className="mt-0.5 font-['Orbitron'] text-xs font-black text-indigo-400">
                                                    {selectedProfile.erp.toLocaleString()}{' '}
                                                    pts
                                                </span>
                                            </div>
                                            {selectedProfile.rank_image ? (
                                                <div className="flex items-center gap-2 rounded-xl border border-[#3b28f6]/10 bg-black/40 px-2.5 py-1">
                                                    <img
                                                        src={
                                                            selectedProfile.rank_image
                                                        }
                                                        alt={
                                                            selectedProfile.rank_name ??
                                                            ''
                                                        }
                                                        className="h-5 w-5 object-contain"
                                                    />
                                                    <span className="font-['Oxanium'] text-[10px] font-bold text-slate-200">
                                                        {
                                                            selectedProfile.rank_name
                                                        }
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="rounded-xl bg-black/20 px-2.5 py-1 font-['Oxanium'] text-[10px] font-bold text-slate-500">
                                                    Unranked
                                                </span>
                                            )}
                                        </div>

                                        {/* Row 2: Completed Course */}
                                        <div className="flex flex-col rounded-2xl border border-[#3b28f6]/10 bg-black/30 px-4 py-3 shadow-inner">
                                            <div className="mb-2 flex w-full items-center justify-between">
                                                <span className="font-['Oxanium'] text-xs font-bold tracking-wider text-slate-400">
                                                    Completed Course
                                                </span>
                                                <div className="flex items-center gap-1">
                                                    <span className="font-['Orbitron'] text-xs font-black text-[#facc15]">
                                                        {
                                                            selectedProfile
                                                                .courses.length
                                                        }
                                                    </span>
                                                    <svg
                                                        className="h-3.5 w-3.5 text-slate-400"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2.5}
                                                            d="M9 5l7 7-7 7"
                                                        />
                                                    </svg>
                                                </div>
                                            </div>

                                            {/* Horizontal list of courses thumbnails/icons */}
                                            {selectedProfile.courses &&
                                            selectedProfile.courses.length >
                                                0 ? (
                                                <div className="custom-scrollbar scrollbar-none flex gap-2.5 overflow-x-auto py-1">
                                                    {selectedProfile.courses.map(
                                                        (course, idx) => (
                                                            <div
                                                                key={idx}
                                                                className="h-7 w-7 shrink-0 overflow-hidden rounded-lg border border-[#3b28f6]/20 bg-black shadow-[0_2px_8px_rgba(0,0,0,0.4)]"
                                                                title={
                                                                    course.name
                                                                }
                                                            >
                                                                {course.thumbnail ? (
                                                                    <img
                                                                        src={
                                                                            course.thumbnail
                                                                        }
                                                                        alt={
                                                                            course.name
                                                                        }
                                                                        className="h-full w-full object-cover"
                                                                    />
                                                                ) : (
                                                                    <div className="flex h-full w-full items-center justify-center bg-indigo-950/40 font-['Oxanium'] text-[9px] font-bold text-indigo-400">
                                                                        {course.name
                                                                            .substring(
                                                                                0,
                                                                                2,
                                                                            )
                                                                            .toUpperCase()}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            ) : (
                                                <p className="font-['Oxanium'] text-[10px] text-slate-500 italic">
                                                    Belum mengikuti kelas apa
                                                    pun.
                                                </p>
                                            )}
                                        </div>

                                        {/* Row 3: Social Handle */}
                                        <div className="flex items-center justify-between rounded-2xl border border-[#3b28f6]/10 bg-black/30 px-4 py-2.5 shadow-inner">
                                            <span className="max-w-[200px] truncate font-['Oxanium'] text-xs font-semibold text-slate-300">
                                                {selectedProfile.linkedin
                                                    ? (() => {
                                                          try {
                                                              const url =
                                                                  selectedProfile.linkedin.replace(
                                                                      /\/$/,
                                                                      '',
                                                                  );
                                                              const parts =
                                                                  url.split(
                                                                      '/',
                                                                  );
                                                              const handle =
                                                                  parts[
                                                                      parts.length -
                                                                          1
                                                                  ];
                                                              return handle
                                                                  ? `@${handle}`
                                                                  : `@${selectedProfile.username}`;
                                                          } catch {
                                                              return `@${selectedProfile.username}`;
                                                          }
                                                      })()
                                                    : `@${selectedProfile.username}`}
                                            </span>
                                            {selectedProfile.linkedin ? (
                                                <a
                                                    href={
                                                        selectedProfile.linkedin
                                                    }
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#3b28f6]/30 bg-gradient-to-tr from-[#3b28f6] to-[#0077b5] text-white shadow-[0_0_10px_rgba(0,119,181,0.4)] transition duration-300 hover:scale-105 active:scale-95"
                                                >
                                                    <svg
                                                        className="h-4 w-4 fill-current"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                                    </svg>
                                                </a>
                                            ) : (
                                                <div className="flex h-8 w-8 cursor-not-allowed items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-600">
                                                    <svg
                                                        className="h-4 w-4 fill-current opacity-40"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </div>
                )}
            </div>

            {/* Image Preview Modal */}
            {previewImage &&
                (() => {
                    const currentMsg =
                        localMessages.find(
                            (m) => m.id === previewImage.msg.id,
                        ) || previewImage.msg;
                    const isSelfImage = currentMsg.sender.id === currentUserId;
                    const previewReactions = groupReactions(
                        currentMsg.reactions || [],
                    );
                    return (
                        <div
                            className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
                            onClick={() => setPreviewImage(null)}
                        >
                            <div
                                onClick={(e) => e.stopPropagation()}
                                className="relative flex max-h-[92vh] w-full max-w-3xl flex-col"
                            >
                                {/* Top bar - ikon polos, tanpa background box */}
                                <div className="flex items-center justify-between px-1 pb-3">
                                    <button
                                        type="button"
                                        onClick={() => setPreviewImage(null)}
                                        className="p-2 text-slate-300 transition-colors hover:text-white"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const a =
                                                document.createElement('a');
                                            a.href = previewImage.url;
                                            a.download =
                                                previewImage.url
                                                    .split('/')
                                                    .pop() || 'lampiran';
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
                                        const hasReacted =
                                            currentMsg.reactions?.some(
                                                (r) =>
                                                    r.user_id ===
                                                        currentUserId &&
                                                    r.emoji === emoji,
                                            );
                                        return (
                                            <button
                                                key={emoji}
                                                type="button"
                                                onClick={() =>
                                                    handleToggleReaction(
                                                        currentMsg.id,
                                                        emoji,
                                                    )
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

                                    {Object.keys(previewReactions).length >
                                        0 && (
                                        <>
                                            <div className="mx-1 h-5 w-px bg-slate-700" />
                                            {Object.entries(
                                                previewReactions,
                                            ).map(
                                                ([emoji, data]: [
                                                    string,
                                                    any,
                                                ]) => (
                                                    <div
                                                        key={emoji}
                                                        className="flex items-center gap-1 text-xs text-slate-300"
                                                        title={data.users.join(
                                                            ', ',
                                                        )}
                                                    >
                                                        <span>{emoji}</span>
                                                        <span>
                                                            {data.count}
                                                        </span>
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
                                            setPreviewImage(null);
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
                                                setPreviewImage(null);
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
                                            onClick={() =>
                                                handleTogglePin(currentMsg.id)
                                            }
                                            className="flex flex-col items-center gap-1 transition-colors hover:text-white"
                                        >
                                            <Pin className="h-5 w-5" />
                                            {currentMsg.is_pinned
                                                ? 'Lepas'
                                                : 'Sematkan'}
                                        </button>
                                    )}

                                    {(isSelfImage || isMentorOrAdmin) && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                handleDeleteMessage(
                                                    currentMsg.id,
                                                );
                                                setPreviewImage(null);
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
                })()}
        </>
    );
}
