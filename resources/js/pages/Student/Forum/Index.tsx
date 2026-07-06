import { useAppearance } from '@/hooks/use-appearance';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, Image as ImageIcon, Send, Smile, Search, User as UserIcon, MoreVertical, Pin, CornerUpLeft, X, Heart, Plus, Pencil, Trash2 } from 'lucide-react';
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

export default function ForumIndex({ auth, user, courses = [], selectedCourse, messages = [], pinnedMessages = [] }: Props) {
    const currentUser = auth?.user || user;
    const currentUserId = currentUser?.id || currentUser?._id || '';
    const isMentorOrAdmin = currentUser?.role === 'mentor' || currentUser?.role === 'admin';

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
    const [activeMenuMessageId, setActiveMenuMessageId] = useState<string | null>(null);
    const [showReactionPickerId, setShowReactionPickerId] = useState<string | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [messageIdToDelete, setMessageIdToDelete] = useState<string | null>(null);

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

            fetch(`/student/forum/${selectedCourse.slug}/messages?after_id=${lastId}`)
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
                            const filteredNew = newMsgs.filter((m) => !existingIds.has(m.id));
                            if (filteredNew.length === 0) return prev;
                            return [...prev, ...filteredNew];
                        });
                        setTimeout(scrollToBottom, 50);
                    }
                })
                .catch((err) => console.error('Error polling forum messages:', err));
        }, 3000);

        return () => clearInterval(interval);
    }, [selectedCourse, localMessages]);

    // Klik di luar picker/menu untuk menutup
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
                setShowEmojiPicker(false);
            }
            // Klik di luar menu pesan untuk menutup
            if (activeMenuMessageId && !(event.target as Element).closest('.message-action-menu')) {
                setActiveMenuMessageId(null);
            }
            if (showReactionPickerId && !(event.target as Element).closest('.reaction-picker')) {
                setShowReactionPickerId(null);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [activeMenuMessageId, showReactionPickerId]);

    // Filter list course grup di sidebar kiri
    const filteredCourses = courses.filter((c) =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Handle kirim pesan
    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCourse || processing) return;
        if (!data.message.trim() && !data.attachment) return;

        if (editingMessage) {
            router.put(`/student/forum/messages/${editingMessage.id}`, {
                message: data.message
            }, {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    setEditingMessage(null);
                    setData(prev => ({
                        ...prev,
                        message: ''
                    }));
                },
                onError: (errors) => {
                    console.error('Gagal mengedit pesan:', errors);
                }
            });
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
            }
        });
    };

    // Fungsi scroll ke pesan spesifik (misal dari kutipan atau pesan tersemat)
    const scrollToMessage = (msgId: string) => {
        const el = messageRefs.current[msgId];
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            el.classList.add('bg-yellow-500/10', 'ring-2', 'ring-[#facc15]/50');
            setTimeout(() => {
                el.classList.remove('bg-yellow-500/10', 'ring-2', 'ring-[#facc15]/50');
            }, 2000);
        }
    };

    // Pilihan emoji cepat & reaksi
    const quickReactions = ['👍', '❤️', '😂', '😮', '😢', '🙏'];
    const emojis = [
        '😀', '😂', '🤣', '😍', '🥰', '😘', '😜', '😎', '👍', '🔥', 
        '🎉', '🚀', '❤️', '👏', '🙌', '💡', '❓', '💻', '💯', '✨'
    ];

    const addEmoji = (emoji: string) => {
        setData('message', data.message + emoji);
        setShowEmojiPicker(false);
    };

    // API reaksi emoji (Optimistik + Inertia)
    const handleToggleReaction = (messageId: string, emoji: string) => {
        // 1. Optimistic Update untuk reaksi
        setLocalMessages(prev =>
            prev.map(m => {
                if (m.id === messageId) {
                    const reactions = [...(m.reactions || [])];
                    const foundIndex = reactions.findIndex(r => r.user_id === auth.user.id);
                    if (foundIndex !== -1) {
                        if (reactions[foundIndex].emoji === emoji) {
                            reactions.splice(foundIndex, 1);
                        } else {
                            reactions[foundIndex] = {
                                ...reactions[foundIndex],
                                emoji: emoji
                            };
                        }
                    } else {
                        reactions.push({
                            user_id: auth.user.id,
                            user_name: auth.user.name,
                            emoji: emoji
                        });
                    }
                    return { ...m, reactions };
                }
                return m;
            })
        );
        setActiveMenuMessageId(null);

        // 2. Background Inertia Request (Partial Reload)
        router.post(`/student/forum/messages/${messageId}/reaction`, { emoji }, {
            preserveState: true,
            preserveScroll: true,
            only: ['messages']
        });
    };

    // API sematkan (pin) pesan (Optimistik + Inertia)
    const handleTogglePin = (messageId: string) => {
        // 1. Optimistic Update untuk pin
        setLocalMessages(prev =>
            prev.map(m => {
                if (m.id === messageId) {
                    return { ...m, is_pinned: !m.is_pinned };
                }
                return m;
            })
        );
        setActiveMenuMessageId(null);

        // 2. Background Inertia Request (Partial Reload)
        router.post(`/student/forum/messages/${messageId}/pin`, {}, {
            preserveState: true,
            preserveScroll: true,
            only: ['messages', 'pinnedMessages']
        });
    };

    // Set replying to state
    const handleReplyTo = (msg: Message) => {
        setReplyingTo(msg);
        setData(prev => ({
            ...prev,
            parent_id: msg.id
        }));
        setActiveMenuMessageId(null);
    };

    const cancelReply = () => {
        setReplyingTo(null);
        setData(prev => ({
            ...prev,
            parent_id: null
        }));
    };

    const handleStartEdit = (msg: Message) => {
        setEditingMessage(msg);
        setData(prev => ({
            ...prev,
            message: msg.message
        }));
        setReplyingTo(null); // Batalkan balas jika sedang membalas
        setActiveMenuMessageId(null);
    };

    const cancelEdit = () => {
        setEditingMessage(null);
        setData(prev => ({
            ...prev,
            message: ''
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
            }
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
            hour12: true
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
                year: '2-digit'
            });
        }
    };

    // List warna acak untuk nama pengirim lain agar bervariasi (seperti WhatsApp)
    const getNameColor = (senderName: string) => {
        const colors = [
            'text-rose-400',
            'text-cyan-400',
            'text-emerald-400',
            'text-amber-400',
            'text-fuchsia-400',
            'text-sky-400',
            'text-teal-400',
            'text-orange-400',
            'text-violet-400',
            'text-lime-400'
        ];
        let hash = 0;
        for (let i = 0; i < senderName.length; i++) {
            hash = senderName.charCodeAt(i) + ((hash << 5) - hash);
        }
        const index = Math.abs(hash) % colors.length;
        return colors[index];
    };

    // Kelompokkan reaksi berdasarkan jenis emoji
    const groupReactions = (reactionsList: Message['reactions']) => {
        const groups: { [key: string]: { count: number; users: string[]; hasReacted: boolean } } = {};
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
            <Head title={`Forum - ${selectedCourse ? selectedCourse.title : 'Diskusi'}`} />
            
            <div className="flex h-screen w-screen overflow-hidden bg-[#020202] text-white">
                {/* ── SIDEBAR KIRI ── */}
                <div className={`flex w-full flex-col border-r border-[#3B28F6]/20 bg-[#05060f] md:w-[350px] lg:w-[400px] shrink-0 ${showChatMobile ? 'hidden md:flex' : 'flex'}`}>
                    
                    {/* Header Sidebar: Tombol Back & Kolom Pencarian */}
                    <div className="p-4 border-b border-[#3B28F6]/20">
                        <div className="flex items-center gap-4 mb-4">
                            <Link
                                href="/student/dashboard"
                                className="group relative flex h-10 w-10 items-center justify-center rounded-xl border border-[#facc15]/80 bg-black/60 transition duration-300 hover:-translate-y-0.5 hover:border-[#facc15]"
                            >
                                <ArrowLeft className="h-5 w-5 text-[#facc15] group-hover:scale-110 transition" />
                                <div className="absolute inset-0 rounded-xl border-t-2 border-r-2 border-[#3B28F6] opacity-50"></div>
                            </Link>
                            <h1 className="font-['Orbitron'] text-lg font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-[#facc15]">
                                FORUM GROUP
                            </h1>
                        </div>

                        {/* Input Pencarian */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Cari grup diskusi..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full rounded-xl border border-[#3B28F6]/30 bg-black/80 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-[#facc15] focus:ring-1 focus:ring-[#facc15]"
                            />
                        </div>
                    </div>

                    {/* Daftar Kursus / Grup */}
                    <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-900 scrollbar-track-transparent">
                        {filteredCourses.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-8 text-center text-slate-500">
                                <p className="text-sm">Tidak ada grup forum yang ditemukan.</p>
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
                                                router.visit(`/student/forum/${group.slug}`);
                                            }
                                        }}
                                        className={`flex cursor-pointer items-center gap-3 border-b border-[#3B28F6]/10 px-4 py-4.5 transition-all duration-300 ${
                                            isActive
                                                ? 'bg-gradient-to-r from-[#3B28F6]/25 to-transparent border-l-4 border-l-[#facc15]'
                                                : 'hover:bg-[#1D215D]/10'
                                        }`}
                                    >
                                        {/* Avatar Kursus */}
                                        <div className="relative h-12 w-12 shrink-0 rounded-xl overflow-hidden border border-[#3B28F6]/30 bg-slate-900">
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
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <h3 className="font-['Oxanium'] text-sm font-semibold truncate text-white leading-none">
                                                    {group.title}
                                                </h3>
                                                {group.last_message && (
                                                    <span className="text-[10px] text-slate-500 whitespace-nowrap ml-2">
                                                        {formatTime(group.last_message.created_at)}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="truncate text-xs text-slate-400">
                                                {group.last_message ? (
                                                    <>
                                                        <span className="font-semibold text-slate-300">
                                                            {group.last_message.sender_name}:
                                                        </span>{' '}
                                                        {group.last_message.message}
                                                    </>
                                                ) : (
                                                    <span className="italic text-slate-600">Belum ada pesan</span>
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
                <div className={`flex-1 flex flex-col bg-[#020202] ${showChatMobile ? 'flex' : 'hidden md:flex'}`}>
                    {selectedCourse ? (
                        <>
                            {/* Header Chat */}
                            <div className="flex items-center justify-between border-b border-[#3B28F6]/20 bg-[#05060f] px-6 py-4.5 shrink-0 z-10">
                                <div className="flex items-center gap-3">
                                    {/* Tombol Back Mobile */}
                                    <button
                                        type="button"
                                        onClick={() => setShowChatMobile(false)}
                                        className="md:hidden mr-1 p-2 rounded-xl border border-[#facc15]/80 bg-black/60 text-[#facc15] hover:border-[#facc15] transition active:scale-95"
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
                                        <h2 className="font-['Orbitron'] text-sm md:text-base font-bold tracking-wide text-white">
                                            {selectedCourse.title}
                                        </h2>
                                        <p className="text-[10px] text-[#facc15]">Diskusi Kelas Aktif</p>
                                    </div>
                                </div>
                            </div>

                            {/* Sticky Bar untuk Pesan Tersemat (Pinned Messages) */}
                            {pinnedMessages.length > 0 && (
                                <div className="bg-[#090b10] border-b border-[#facc15]/20 px-6 py-2.5 flex items-center justify-between text-xs text-slate-300 font-['Oxanium'] shrink-0 z-10">
                                    <div 
                                        className="flex items-center gap-2 cursor-pointer hover:text-white truncate flex-1"
                                        onClick={() => scrollToMessage(pinnedMessages[pinnedMessages.length - 1].id)}
                                    >
                                        <Pin className="h-3.5 w-3.5 text-[#facc15] shrink-0 rotate-45" />
                                        <span className="font-bold text-[#facc15] shrink-0">Sematkan:</span>
                                        <span className="truncate italic">
                                            "{pinnedMessages[pinnedMessages.length - 1].message}"
                                        </span>
                                    </div>
                                    <span className="text-[10px] text-slate-500 ml-4 shrink-0 font-['Orbitron']">
                                        Oleh {pinnedMessages[pinnedMessages.length - 1].sender_name}
                                    </span>
                                </div>
                            )}

                            {/* Feed Diskusi / Chat Area */}
                            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 bg-radial-gradient from-indigo-950/5 via-transparent to-transparent">
                                {localMessages.length === 0 ? (
                                    <div className="flex h-full flex-col items-center justify-center text-center text-slate-500">
                                        <div className="rounded-full bg-slate-900/50 p-4 mb-2">
                                            <Smile className="h-8 w-8 text-[#facc15]" />
                                        </div>
                                        <h4 className="font-semibold text-sm text-slate-400">Belum ada pesan di forum ini</h4>
                                        <p className="text-xs text-slate-500 mt-1 max-w-[280px]">Mulai obrolan baru dengan mengirimkan pertanyaan atau tanggapan Anda di bawah.</p>
                                    </div>
                                ) : (
                                    localMessages.map((msg, index) => {
                                        const isSelf = msg.sender.id === currentUserId;
                                        const isSystem = msg.sender.role === 'system';

                                        // Cek apakah tanggal berbeda dari pesan sebelumnya untuk pembagi hari
                                        const showDateDivider =
                                            index === 0 ||
                                            new Date(localMessages[index - 1].created_at).toDateString() !==
                                                new Date(msg.created_at).toDateString();

                                        if (isSystem) {
                                            return (
                                                <div key={msg.id} className="flex justify-center my-2">
                                                    <span className="rounded-full bg-slate-900/80 border border-slate-800 px-3 py-1 text-[10px] text-slate-500 font-['Oxanium']">
                                                        {msg.message}
                                                    </span>
                                                </div>
                                            );
                                        }

                                        const reactionsGrouped = groupReactions(msg.reactions);

                                        return (
                                            <React.Fragment key={msg.id}>
                                                {showDateDivider && (
                                                    <div className="flex justify-center my-4">
                                                        <span className="rounded-md bg-slate-950/80 border border-[#3B28F6]/10 px-3 py-1 text-[10px] uppercase font-bold tracking-wider text-[#facc15] font-['Orbitron']">
                                                            {formatHeaderDate(msg.created_at)}
                                                        </span>
                                                    </div>
                                                )}

                                                <div 
                                                    ref={(el) => { messageRefs.current[msg.id] = el; }}
                                                    className={`group relative flex gap-3 max-w-[85%] md:max-w-[70%] transition-all duration-500 rounded-2xl ${isSelf ? 'ml-auto flex-row-reverse' : 'mr-auto'} ${Object.keys(reactionsGrouped).length > 0 ? 'mb-4.5' : ''}`}
                                                >
                                                    
                                                    {/* Avatar Pengirim */}
                                                    {!isSelf && (
                                                        <div className="h-9 w-9 shrink-0 overflow-hidden rounded-lg border border-[#3B28F6]/30 bg-slate-900">
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
                                                    )}

                                                    {/* Balon Chat Container */}
                                                    <div className="relative flex flex-col">
                                                        
                                                        {/* ── MENU PILIHAN (Klik Bubble Chat) ── */}
                                                        {activeMenuMessageId === msg.id && (
                                                            <div 
                                                                onClick={(e) => e.stopPropagation()} // Mencegah tertutupnya menu
                                                                className={`message-action-menu absolute bottom-full mb-2 z-30 flex flex-col bg-[#05060f]/95 border border-[#3B28F6]/40 backdrop-blur-md rounded-xl p-2 shadow-2xl scale-100 transition-all ${
                                                                    isSelf ? 'right-0' : 'left-0'
                                                                }`}
                                                                style={{ minWidth: '180px' }}
                                                            >
                                                                {/* Quick Reaction Bar */}
                                                                <div className="flex items-center justify-between gap-1 border-b border-[#3B28F6]/20 pb-2 mb-2">
                                                                    {quickReactions.map((emoji) => (
                                                                        <button
                                                                            key={emoji}
                                                                            type="button"
                                                                            onClick={() => handleToggleReaction(msg.id, emoji)}
                                                                            className="hover:scale-125 transition px-1.5 py-0.5 active:scale-95 text-base"
                                                                        >
                                                                            {emoji}
                                                                        </button>
                                                                    ))}
                                                                </div>

                                                                {/* Actions List */}
                                                                <div className="flex flex-col text-xs font-['Oxanium']">
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
                                                                setActiveMenuMessageId(activeMenuMessageId === msg.id ? null : msg.id);
                                                            }}
                                                            className={`relative flex flex-col rounded-2xl px-4 py-3 border-2 cursor-pointer transition duration-200 active:scale-[0.99] select-none ${
                                                                isSelf
                                                                    ? 'bg-[#090b10] border-[#facc15] hover:bg-[#10131d] rounded-tr-none'
                                                                    : 'bg-[#05060f] border-[#3B28F6]/80 hover:bg-[#0c0e1d] rounded-tl-none'
                                                            } ${msg.is_pinned ? 'shadow-[0_0_10px_rgba(250,204,21,0.2)]' : ''} ${Object.keys(reactionsGrouped).length > 0 ? 'pb-5.5' : ''}`}
                                                        >
                                                            {/* Indikator Pin Kecil */}
                                                            {msg.is_pinned && (
                                                                <div className="flex items-center gap-1 text-[9px] text-[#facc15] mb-1 font-['Orbitron']">
                                                                    <Pin className="h-2.5 w-2.5 rotate-45" /> Disematkan
                                                                </div>
                                                            )}

                                                            {/* Render Kutipan Pesan (Jika Balasan) */}
                                                            {msg.parent && (
                                                                <div 
                                                                    onClick={(e) => {
                                                                        e.stopPropagation(); // Mencegah menu terbuka jika mengklik kutipan
                                                                        scrollToMessage(msg.parent!.id);
                                                                    }}
                                                                    className="mb-2 cursor-pointer border-l-3 border-[#3B28F6] bg-black/40 px-3 py-1.5 rounded-r-lg text-left hover:bg-black/60 transition"
                                                                >
                                                                    <p className="font-['Oxanium'] text-[10px] font-bold text-[#3B28F6]">
                                                                        {msg.parent.sender_name}
                                                                    </p>
                                                                    <p className="font-['Oxanium'] text-[11px] text-slate-400 truncate">
                                                                        {msg.parent.message}
                                                                    </p>
                                                                </div>
                                                            )}

                                                            {/* Nama & Peran Pengirim */}
                                                            {!isSelf && (
                                                                <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                                                                    <span className={`font-['Oxanium'] text-xs font-bold ${getNameColor(msg.sender.name)}`}>
                                                                        {msg.sender.name}
                                                                    </span>
                                                                    {msg.sender.role === 'admin' && (
                                                                        <span className="rounded bg-rose-500/20 border border-rose-500/30 px-1 py-0.5 text-[8px] font-bold uppercase tracking-wider text-rose-400">
                                                                            Admin
                                                                        </span>
                                                                    )}
                                                                    {msg.sender.role === 'mentor' && (
                                                                        <span className="rounded bg-emerald-500/20 border border-emerald-500/30 px-1 py-0.5 text-[8px] font-bold uppercase tracking-wider text-emerald-400">
                                                                            Mentor
                                                                        </span>
                                                                    )}
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
                                                                            className="max-h-[220px] w-full object-cover cursor-pointer hover:scale-[1.01] transition duration-200"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation(); // Mencegah menu terbuka jika mengklik lampiran
                                                                                window.open(url, '_blank');
                                                                            }}
                                                                        />
                                                                    ))}
                                                                </div>
                                                            )}

                                                            {/* Teks Pesan */}
                                                            {msg.message && (
                                                                <p className="font-['Oxanium'] text-xs md:text-sm text-slate-100 whitespace-pre-wrap break-words leading-relaxed select-text">
                                                                    {msg.message}
                                                                </p>
                                                            )}

                                                            {/* Waktu Kirim */}
                                                            <span className={`text-[9px] text-right mt-1.5 ${isSelf ? 'text-[#facc15]/80' : 'text-slate-500'}`}>
                                                                    {formatTime(msg.created_at)}
                                                            </span>

                                                            {/* Badges Reaksi Melayang di Pinggir Balon */}
                                                            {Object.keys(reactionsGrouped).length > 0 && (
                                                                <div className={`absolute -bottom-3 flex flex-wrap gap-1 z-10 ${isSelf ? 'right-4' : 'left-4'}`}>
                                                                    {Object.entries(reactionsGrouped).map(([emoji, data]) => (
                                                                        <button
                                                                            key={emoji}
                                                                            type="button"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleToggleReaction(msg.id, emoji);
                                                                            }}
                                                                            title={data.users.join(', ')}
                                                                            className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] transition active:scale-90 ${
                                                                                data.hasReacted
                                                                                    ? 'bg-[#facc15]/25 border-[#facc15] text-[#facc15] shadow-lg'
                                                                                    : 'bg-[#05060f] border-[#3B28F6]/40 text-slate-300 hover:border-slate-500'
                                                                            }`}
                                                                        >
                                                                            <span>{emoji}</span>
                                                                            <span className="font-bold">{data.count}</span>
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
                                className="border-t border-[#3B28F6]/20 bg-[#05060f] px-6 py-4 flex flex-col gap-3.5 relative shrink-0"
                            >
                                {/* Pratinjau Balasan Pesan (Quoted Preview Box) */}
                                {replyingTo && (
                                    <div className="w-full flex items-center justify-between rounded-xl border-l-4 border-l-[#3B28F6] bg-[#0c0d19] px-4 py-3 text-xs shadow-inner">
                                        <div className="truncate pr-4 text-left">
                                            <p className="font-['Oxanium'] font-bold text-[#3B28F6] mb-0.5">
                                                {replyingTo.sender.name}
                                            </p>
                                            <p className="font-['Oxanium'] text-[11px] text-slate-400 truncate">
                                                {replyingTo.message ?? '[Lampiran Gambar]'}
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={cancelReply}
                                            className="rounded-full hover:bg-slate-900 p-1 text-slate-400 hover:text-white transition active:scale-90"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                )}

                                 {/* Pratinjau Edit Pesan (Editing Box) */}
                                {editingMessage && (
                                    <div className="w-full flex items-center justify-between rounded-xl border-l-4 border-l-[#facc15] bg-[#0c0d19] px-4 py-3 text-xs shadow-inner">
                                        <div className="truncate pr-4 text-left">
                                            <p className="font-['Oxanium'] font-bold text-[#facc15] mb-0.5">
                                                Mengedit pesan Anda
                                            </p>
                                            <p className="font-['Oxanium'] text-[11px] text-slate-400 truncate">
                                                {editingMessage.message}
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={cancelEdit}
                                            className="rounded-full hover:bg-slate-900 p-1 text-slate-400 hover:text-white transition active:scale-90"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                )}

                                {/* Pratinjau Gambar Sebelum Dikirim */}
                                {imagePreview && (
                                    <div className="w-full flex items-center justify-between rounded-xl border border-[#facc15]/30 bg-[#0c0d19] p-3">
                                        <div className="flex items-center gap-3">
                                            <div className="h-14 w-14 overflow-hidden rounded-lg border border-slate-700 bg-black">
                                                <img src={imagePreview} className="h-full w-full object-cover" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-slate-300">Siap dikirim</p>
                                                <p className="text-[10px] text-slate-500">Lampiran gambar</p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            className="rounded-lg bg-slate-900 border border-slate-700 px-3 py-1.5 text-xs text-rose-400 hover:bg-slate-800 transition active:scale-95"
                                        >
                                            Batal
                                        </button>
                                    </div>
                                )}

                                {/* Input Row */}
                                <div className="flex items-center gap-3 w-full">
                                    {/* Tombol Lampirkan File Gambar */}
                                    {!editingMessage && (
                                        <>
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
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

                                    {/* Tombol Emoji */}
                                    <div className="relative flex" ref={emojiPickerRef}>
                                        <button
                                            type="button"
                                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#3B28F6]/30 bg-black/60 text-slate-400 transition hover:border-[#facc15] hover:text-[#facc15] active:scale-95"
                                        >
                                            <Smile className="h-5 w-5" />
                                        </button>
                                        
                                        {showEmojiPicker && (
                                            <div className="absolute bottom-12 left-0 z-50 grid grid-cols-5 gap-2 rounded-xl border border-[#3B28F6]/40 bg-[#05060f] p-3 shadow-xl w-[190px]">
                                                {emojis.map((emoji) => (
                                                    <button
                                                        key={emoji}
                                                        type="button"
                                                        onClick={() => addEmoji(emoji)}
                                                        className="flex h-7 w-7 items-center justify-center rounded text-base hover:bg-[#1D215D]/40 transition active:scale-95"
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
                                        onChange={(e) => setData('message', e.target.value)}
                                        disabled={processing}
                                        className="flex-1 rounded-xl border border-[#3B28F6]/30 bg-black/80 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-[#facc15] focus:ring-1 focus:ring-[#facc15] disabled:opacity-50"
                                    />

                                    {/* Tombol Kirim */}
                                    <button
                                        type="submit"
                                        disabled={processing || (!data.message.trim() && !data.attachment)}
                                        className="group relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#facc15]/80 bg-black/60 text-[#facc15] transition duration-300 hover:-translate-y-0.5 hover:border-[#facc15] disabled:opacity-30 disabled:pointer-events-none"
                                    >
                                        <Send className="h-5 w-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
                                        <div className="absolute inset-0 rounded-xl border-t-2 border-r-2 border-[#3B28F6] opacity-50"></div>
                                    </button>
                                </div>
                            </form>
                        </>
                    ) : (
                        <div className="flex h-full flex-col items-center justify-center text-center p-8 text-slate-500">
                            <h3 className="font-['Orbitron'] text-base font-bold text-slate-400 mb-1">Pilih Obrolan Forum</h3>
                            <p className="text-xs text-slate-500 max-w-[280px]">Grup chat akan ditampilkan berdasarkan daftar kelas/kursus yang Anda ikuti.</p>
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
            </div>
        </>
    );
}
