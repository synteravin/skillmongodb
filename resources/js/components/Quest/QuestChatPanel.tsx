import { usePage } from '@inertiajs/react';
import React, { useEffect, useRef, useState } from 'react';
import {
    Send,
    X,
    MessageSquare,
    ShieldAlert,
    Paperclip,
    Download,
    FileText,
    Image as ImageIcon,
    Lock,
    Users,
} from 'lucide-react';

interface Message {
    id: string;
    message: string;
    created_at: string;
    sender: {
        id: string;
        _id?: string;
        name: string;
        role: string;
    };
    file?: {
        name: string;
        url: string;
        size: number;
    } | null;
}

interface Props {
    bidId: string;
    questTitle: string;
    targetUserName: string;
    isDisputed?: boolean;
    onClose?: () => void;
    creatorId?: string;
    workerId?: string;
    embedded?: boolean;
    className?: string;
    isLocked?: boolean;
    lockedReason?: string;
}

export default function QuestChatPanel({
    bidId,
    questTitle,
    targetUserName,
    isDisputed = false,
    onClose,
    creatorId,
    workerId,
    embedded = false,
    className = '',
    isLocked = false,
    lockedReason,
}: Props) {
    const { props } = usePage<any>();
    const currentUser = props.auth?.user;

    const isAdmin = currentUser?.role === 'admin';
    const isCreator = currentUser?.id === creatorId || currentUser?._id === creatorId;
    const isWorker = currentUser?.id === workerId || currentUser?._id === workerId;

    type ChannelType = 'tripartite' | 'caucus_creator' | 'caucus_worker';
    const [activeChannel, setActiveChannel] = useState<ChannelType>('tripartite');

    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
    const [chatError, setChatError] = useState<string | null>(null);

    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const pollingIntervalRef = useRef<any>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Keep latest messages in ref to decouple polling from render dependencies
    const messagesRef = useRef<Message[]>([]);
    messagesRef.current = messages;

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    // Scroll to bottom (isolated to chat container only, NEVER scrolls the page or window)
    const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTo({
                top: messagesContainerRef.current.scrollHeight,
                behavior,
            });
        }
    };

    // Fetch initial messages
    const fetchInitialMessages = async (channel: ChannelType = activeChannel) => {
        try {
            const response = await fetch(`/quests/bids/${bidId}/messages?channel_type=${channel}`);
            if (response.ok) {
                const data = await response.json();
                setMessages(data);
                setTimeout(() => scrollToBottom('auto'), 60);
            }
        } catch (error) {
            console.error('Failed to fetch chat messages', error);
        } finally {
            setLoading(false);
        }
    };

    // Poll for new messages without triggering unwanted scrolls or page jumps
    const pollNewMessages = async (channel: ChannelType = activeChannel) => {
        try {
            const currentMessages = messagesRef.current;
            const lastId =
                currentMessages.length > 0
                    ? currentMessages[currentMessages.length - 1].id
                    : '';

            // Do not poll with empty lastId if initial messages have not finished loading yet
            if (!lastId && currentMessages.length === 0) {
                return;
            }

            const url = lastId
                ? `/quests/bids/${bidId}/messages?channel_type=${channel}&after_id=${lastId}`
                : `/quests/bids/${bidId}/messages?channel_type=${channel}`;

            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                if (Array.isArray(data) && data.length > 0) {
                    const existingIds = new Set(messagesRef.current.map((m) => String(m.id)));
                    const filteredNew = data.filter(
                        (m: Message) => !existingIds.has(String(m.id)),
                    );

                    // ONLY update state and scroll if there are genuinely new messages
                    if (filteredNew.length > 0) {
                        setMessages((prev) => {
                            const prevIds = new Set(prev.map((m) => String(m.id)));
                            const trulyNew = filteredNew.filter((m) => !prevIds.has(String(m.id)));
                            if (trulyNew.length === 0) return prev;
                            return [...prev, ...trulyNew];
                        });

                        // Only scroll chat container if user is already at or very near bottom (< 80px)
                        const container = messagesContainerRef.current;
                        const isNearBottom = container
                            ? container.scrollHeight - container.scrollTop - container.clientHeight < 80
                            : true;

                        if (isNearBottom) {
                            setTimeout(() => scrollToBottom('smooth'), 60);
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error polling messages', error);
        }
    };

    // Setup polling interval once per channel / bidId switch
    useEffect(() => {
        setLoading(true);
        setMessages([]);
        fetchInitialMessages(activeChannel);

        const intervalId = setInterval(() => {
            pollNewMessages(activeChannel);
        }, 3000);

        return () => {
            clearInterval(intervalId);
        };
    }, [bidId, activeChannel]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if ((!newMessage.trim() && !attachmentFile) || sending) return;

        setSending(true);
        try {
            const csrfToken = (
                document.querySelector(
                    'meta[name="csrf-token"]',
                ) as HTMLMetaElement
            )?.content;

            const formData = new FormData();
            if (newMessage.trim()) {
                formData.append('message', newMessage);
            }
            if (attachmentFile) {
                formData.append('file', attachmentFile);
            }
            formData.append('channel_type', activeChannel);

            const response = await fetch(`/quests/bids/${bidId}/messages`, {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': csrfToken || '',
                    Accept: 'application/json',
                },
                body: formData,
            });

            if (response.ok) {
                const newMsg: Message = await response.json();
                setMessages((prev) => {
                    const existingIds = new Set(prev.map((m) => String(m.id)));
                    if (existingIds.has(String(newMsg.id))) return prev;
                    return [...prev, newMsg];
                });
                setNewMessage('');
                setAttachmentFile(null);
                setChatError(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                setTimeout(() => scrollToBottom('smooth'), 50);
            } else {
                const errData = await response.json().catch(() => ({}));
                setChatError(errData.error || 'Gagal mengirim pesan.');
            }
        } catch (error) {
            console.error('Failed to send message', error);
            setChatError('Terjadi kesalahan saat mengirim pesan.');
        } finally {
            setSending(false);
        }
    };

    const formatTime = (isoString: string) => {
        try {
            return new Date(isoString).toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit',
            });
        } catch (e) {
            return '';
        }
    };

    return (
        <div
            className={
                embedded
                    ? `relative flex h-[500px] w-full flex-col rounded-2xl border border-slate-300 bg-white shadow-sm overflow-hidden dark:border-slate-800 dark:bg-[#0d1117] ${className}`
                    : 'fixed inset-y-0 right-0 z-50 flex w-full flex-col border-l border-slate-200 bg-white shadow-2xl transition-all duration-300 sm:w-[450px] dark:border-slate-800 dark:bg-[#0d1117]'
            }
        >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 bg-[#f5f6ff] p-4 dark:border-slate-800 dark:bg-[#0d0f17]">
                <div className="flex min-w-0 items-center gap-2.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-650 dark:bg-slate-800 dark:text-indigo-400">
                        <MessageSquare className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                        <h4 className="truncate text-sm font-bold text-slate-900 dark:text-white">
                            {isDisputed
                                ? activeChannel === 'tripartite'
                                    ? 'Ruang Mediasi Tripartit'
                                    : activeChannel === 'caucus_creator'
                                      ? (isAdmin ? 'Kaukus Klien (Privat)' : 'Kaukus Privat Mediator')
                                      : (isAdmin ? 'Kaukus Pekerja (Privat)' : 'Kaukus Privat Mediator')
                                : targetUserName}
                        </h4>
                        <span className="block truncate text-[10px] text-slate-405 dark:text-slate-500">
                            Proyek: {questTitle}
                        </span>
                    </div>
                </div>

                {onClose && (
                    <button
                        onClick={onClose}
                        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-250 dark:text-slate-400 dark:hover:bg-white/5"
                    >
                        <X size={18} />
                    </button>
                )}
            </div>

            {/* Bilateral Caucus Channels Navigation (Dispute Mode) */}
            {isDisputed && (
                <div className="flex border-b border-slate-200 bg-white px-3 pt-1.5 text-xs font-bold dark:border-slate-800 dark:bg-[#0d1117] overflow-x-auto gap-1">
                    <button
                        type="button"
                        onClick={() => setActiveChannel('tripartite')}
                        className={`flex items-center gap-1.5 px-3 py-2 border-b-2 transition-all cursor-pointer whitespace-nowrap text-xs ${
                            activeChannel === 'tripartite'
                                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400 font-extrabold'
                                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                        }`}
                    >
                        <Users size={13} />
                        <span>Ruang Tripartit</span>
                    </button>

                    {(isAdmin || isCreator) && (
                        <button
                            type="button"
                            onClick={() => setActiveChannel('caucus_creator')}
                            className={`flex items-center gap-1.5 px-3 py-2 border-b-2 transition-all cursor-pointer whitespace-nowrap text-xs ${
                                activeChannel === 'caucus_creator'
                                    ? 'border-amber-600 text-amber-600 dark:border-amber-400 dark:text-amber-400 font-extrabold'
                                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                            }`}
                        >
                            <Lock size={12} />
                            <span>{isAdmin ? 'Kaukus Klien' : 'Kaukus Privat Mediator'}</span>
                        </button>
                    )}

                    {(isAdmin || isWorker) && (
                        <button
                            type="button"
                            onClick={() => setActiveChannel('caucus_worker')}
                            className={`flex items-center gap-1.5 px-3 py-2 border-b-2 transition-all cursor-pointer whitespace-nowrap text-xs ${
                                activeChannel === 'caucus_worker'
                                    ? 'border-purple-600 text-purple-600 dark:border-purple-400 dark:text-purple-400 font-extrabold'
                                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                            }`}
                        >
                            <Lock size={12} />
                            <span>{isAdmin ? 'Kaukus Pekerja' : 'Kaukus Privat Mediator'}</span>
                        </button>
                    )}
                </div>
            )}

            {/* Messages Area */}
            <div
                ref={messagesContainerRef}
                className="scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800 flex-1 space-y-4 overflow-y-auto bg-[#f8fafc] p-4 dark:bg-[#030712]"
            >
                {isDisputed && (
                    activeChannel === 'tripartite' ? (
                        <div className="flex gap-2.5 rounded-xl border border-indigo-100 bg-indigo-50/20 p-3.5 text-xs text-indigo-900 dark:border-indigo-900/40 dark:bg-indigo-950/20 dark:text-indigo-300">
                            <Users className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
                            <div className="space-y-0.5">
                                <span className="block text-[10px] font-bold tracking-wider uppercase">
                                    Ruang Mediasi Tripartit (Pleno Bersama)
                                </span>
                                <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-400">
                                    Saluran musyawarah terbuka antara Dewan Mediator, Klien, dan Pekerja. Seluruh pesan dan berkas di saluran ini dapat ditinjau oleh ketiga pihak.
                                </p>
                            </div>
                        </div>
                    ) : activeChannel === 'caucus_creator' ? (
                        <div className="flex gap-2.5 rounded-xl border border-amber-200 bg-amber-50/30 p-3.5 text-xs text-amber-900 dark:border-amber-800/50 dark:bg-amber-950/30 dark:text-amber-300">
                            <Lock className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400 animate-pulse" />
                            <div className="space-y-0.5">
                                <span className="block text-[10px] font-bold tracking-wider uppercase text-amber-800 dark:text-amber-300">
                                    Sesi Kaukus Tertutup: Klien & Mediator
                                </span>
                                <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-400">
                                    Saluran privat konfidensial antara Klien dan Dewan Mediator. Pekerja sama sekali tidak memiliki akses dan tidak dapat melihat pesan di sesi ini.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex gap-2.5 rounded-xl border border-purple-200 bg-purple-50/30 p-3.5 text-xs text-purple-900 dark:border-purple-800/50 dark:bg-purple-950/30 dark:text-purple-300">
                            <Lock className="mt-0.5 h-4 w-4 shrink-0 text-purple-600 dark:text-purple-400 animate-pulse" />
                            <div className="space-y-0.5">
                                <span className="block text-[10px] font-bold tracking-wider uppercase text-purple-800 dark:text-purple-300">
                                    Sesi Kaukus Tertutup: Pekerja & Mediator
                                </span>
                                <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-400">
                                    Saluran privat konfidensial antara Pekerja dan Dewan Mediator. Klien sama sekali tidak memiliki akses dan tidak dapat melihat pesan di sesi ini.
                                </p>
                            </div>
                        </div>
                    )
                )}
                {loading ? (
                    <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-400">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
                        <span className="text-xs">Memuat obrolan...</span>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="text-slate-405 flex h-full flex-col items-center justify-center space-y-2 p-6 text-center">
                        <MessageSquare className="h-12 w-12 stroke-1 text-slate-300 dark:text-slate-700" />
                        <h5 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                            Belum Ada Obrolan
                        </h5>
                        <p className="text-xs text-slate-400">
                            Kirim pesan pertama Anda untuk memulai diskusi
                            mengenai proyek ini.
                        </p>
                    </div>
                ) : (
                    messages.map((msg) => {
                        const currentUserId = String(currentUser?.id || currentUser?._id || '');
                        const senderId = String(msg.sender?.id || msg.sender?._id || '');
                        const isSelf = Boolean(currentUserId && senderId && currentUserId === senderId);

                        const isCreatorSender = Boolean(
                            creatorId && (senderId === String(creatorId))
                        );
                        const isWorkerSender = Boolean(
                            workerId && (senderId === String(workerId))
                        );

                        return (
                            <div
                                key={msg.id}
                                className={`flex flex-col ${isSelf ? 'items-end' : 'items-start'}`}
                            >
                                <span className="mb-1 flex items-center gap-1 px-1 text-[9px] text-slate-400">
                                    <span>
                                        {isSelf ? 'Anda' : msg.sender.name}
                                    </span>
                                    <span>•</span>
                                    {msg.sender.role === 'admin' ? (
                                        <span className="text-red-650 rounded bg-red-50 px-1 py-0.5 text-[8px] font-bold tracking-wider uppercase dark:bg-red-500/10 dark:text-red-400">
                                            Mediator
                                        </span>
                                    ) : isCreatorSender ? (
                                        <span className="text-blue-650 rounded bg-blue-50 px-1 py-0.5 text-[8px] font-bold tracking-wider uppercase dark:bg-blue-500/10 dark:text-blue-400">
                                            Klien
                                        </span>
                                    ) : isWorkerSender ? (
                                        <span className="dark:text-emerald-455 rounded bg-emerald-50 px-1 py-0.5 text-[8px] font-bold tracking-wider text-emerald-600 uppercase dark:bg-emerald-500/10">
                                            Pekerja
                                        </span>
                                    ) : (
                                        <span className="rounded bg-slate-100 px-1 py-0.5 text-[8px] font-bold tracking-wider text-slate-500 uppercase dark:bg-slate-800 dark:text-slate-400">
                                            Siswa
                                        </span>
                                    )}
                                </span>
                                <div
                                    className={`relative max-w-[85%] sm:max-w-[78%] rounded-2xl px-3.5 py-2.5 text-xs shadow-[0_1px_2px_rgba(0,0,0,0.06)] transition-all ${
                                        isSelf
                                            ? 'rounded-tr-xs border border-indigo-200 bg-[#e0e7ff] text-[#1e1b4b] dark:border-[#3b4b61] dark:bg-[#232d3f] dark:text-[#f1f5f9]'
                                            : 'rounded-tl-xs border border-slate-200 bg-white text-slate-850 dark:border-[#334155] dark:bg-[#1e293b] dark:text-[#f1f5f9]'
                                    }`}
                                >
                                    {msg.message && (
                                        <p className="leading-relaxed break-words whitespace-pre-wrap">
                                            {msg.message}
                                        </p>
                                    )}

                                    {msg.file && (
                                        <div
                                            className={`mt-2 ${msg.message ? 'border-t border-slate-200/50 pt-2 dark:border-slate-800' : ''}`}
                                        >
                                            {msg.file.name.match(
                                                /\.(jpeg|jpg|gif|png)$/i,
                                            ) ? (
                                                <div className="group relative max-w-[240px] overflow-hidden rounded border border-slate-200/30 bg-black/5 dark:border-slate-800 dark:bg-black/40">
                                                    <img
                                                        src={msg.file.url}
                                                        alt={msg.file.name}
                                                        className="max-h-40 w-auto rounded object-cover"
                                                    />
                                                    <a
                                                        href={msg.file.url}
                                                        download
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="absolute inset-0 flex items-center justify-center rounded bg-black/45 text-white opacity-0 transition-opacity group-hover:opacity-100"
                                                    >
                                                        <Download size={18} />
                                                    </a>
                                                </div>
                                            ) : (
                                                <div
                                                    className={`flex items-center justify-between gap-3 rounded-lg border p-2 text-xs ${
                                                        isSelf
                                                            ? 'border-[#c7d2fe]/50 bg-white/50 text-[#1e1b4b] dark:border-[#3b4b61]/45 dark:bg-black/20 dark:text-[#f1f5f9]'
                                                            : 'border-slate-200/40 bg-black/5 text-slate-800 dark:border-slate-800 dark:bg-black/20 dark:text-slate-200'
                                                    }`}
                                                >
                                                    <div className="flex min-w-0 items-center gap-2">
                                                        <FileText
                                                            className={`h-5 w-5 shrink-0 ${isSelf ? 'text-indigo-600 dark:text-indigo-400' : 'text-indigo-400'}`}
                                                        />
                                                        <div className="min-w-0">
                                                            <p
                                                                className={`truncate text-xs font-semibold ${isSelf ? 'text-[#1e1b4b]' : 'text-slate-705 dark:text-slate-200'}`}
                                                            >
                                                                {msg.file.name}
                                                            </p>
                                                            <p
                                                                className={`text-[9px] ${isSelf ? 'text-[#1e1b4b]/60 dark:text-[#f1f5f9]/60' : 'text-slate-400'}`}
                                                            >
                                                                {formatFileSize(
                                                                    msg.file
                                                                        .size,
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <a
                                                        href={msg.file.url}
                                                        download
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className={`flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded transition-colors ${
                                                            isSelf
                                                                ? 'bg-[#c7d2fe]/45 text-[#1e1b4b] hover:bg-[#c7d2fe]/70 dark:bg-slate-800 dark:text-[#f1f5f9] dark:hover:bg-slate-700'
                                                                : 'text-indigo-650 bg-indigo-500/10 hover:bg-indigo-500/20 dark:text-indigo-400'
                                                        }`}
                                                        title="Unduh Berkas"
                                                    >
                                                        <Download className="h-4 w-4" />
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <span
                                        className={`mt-1.5 block text-right text-[9px] ${
                                            isSelf
                                                ? 'text-indigo-900/60 dark:text-[#f1f5f9]/60'
                                                : 'text-slate-400 dark:text-slate-500'
                                        }`}
                                    >
                                        {formatTime(msg.created_at)}
                                    </span>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Selected File Preview */}
            {attachmentFile && (
                <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-700 dark:border-slate-800 dark:bg-[#0f1322] dark:text-slate-300">
                    <div className="flex min-w-0 items-center gap-2">
                        <FileText className="text-indigo-550 h-4 w-4 shrink-0" />
                        <span className="truncate font-semibold">
                            {attachmentFile.name}
                        </span>
                        <span className="text-[10px] text-slate-400">
                            ({formatFileSize(attachmentFile.size)})
                        </span>
                    </div>
                    <button
                        type="button"
                        onClick={() => setAttachmentFile(null)}
                        className="cursor-pointer text-slate-400 hover:text-red-500"
                    >
                        <X size={16} />
                    </button>
                </div>
            )}

            {/* Chat Error Alert */}
            {chatError && (
                <div className="flex items-center justify-between border-t border-red-200 bg-red-50 p-2.5 text-xs text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
                    <span>{chatError}</span>
                    <button
                        type="button"
                        onClick={() => setChatError(null)}
                        className="cursor-pointer text-red-500 hover:text-red-700"
                    >
                        <X size={14} />
                    </button>
                </div>
            )}

            {/* Input Area or Locked State */}
            {isLocked ? (
                <div className="flex items-center justify-center gap-2 border-t border-slate-200 bg-slate-50 p-4 text-xs font-semibold text-slate-500 dark:border-slate-800 dark:bg-[#0d0f17] dark:text-slate-400">
                    <Lock size={15} className="text-amber-500 shrink-0" />
                    <span>{lockedReason || 'Ruang mediasi telah dikunci pasca putusan arbitrase resmi.'}</span>
                </div>
            ) : (
                <form
                    onSubmit={handleSendMessage}
                    className="flex items-center gap-2 border-t border-slate-200 bg-[#f5f6ff] p-4 dark:border-slate-800 dark:bg-[#0d0f17]"
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                setAttachmentFile(file);
                            }
                        }}
                        className="hidden"
                    />
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:bg-[#030712] dark:text-slate-400 dark:hover:bg-slate-800"
                        title="Lampirkan File"
                    >
                        <Paperclip size={16} />
                    </button>
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Tulis pesan..."
                        className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-800 dark:bg-[#030712] dark:text-white dark:placeholder-slate-500"
                    />
                    <button
                        type="submit"
                        disabled={
                            (!newMessage.trim() && !attachmentFile) || sending
                        }
                        className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-500/20 transition-all hover:from-indigo-500 hover:to-indigo-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 dark:from-indigo-600 dark:to-indigo-500 dark:hover:from-indigo-500 dark:hover:to-indigo-400"
                    >
                        <Send size={16} />
                    </button>
                </form>
            )}
        </div>
    );
}
