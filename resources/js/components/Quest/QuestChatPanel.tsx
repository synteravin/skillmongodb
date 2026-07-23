import { usePage } from '@inertiajs/react';
import React, { useEffect, useRef, useState } from 'react';
import { Send, X, MessageSquare, ShieldAlert, Paperclip, Download, FileText, Image as ImageIcon } from 'lucide-react';

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
    onClose: () => void;
    creatorId?: string;
    workerId?: string;
}

export default function QuestChatPanel({
    bidId,
    questTitle,
    targetUserName,
    isDisputed = false,
    onClose,
    creatorId,
    workerId,
}: Props) {
    const { props } = usePage<any>();
    const currentUser = props.auth?.user;

    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [attachmentFile, setAttachmentFile] = useState<File | null>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const pollingIntervalRef = useRef<any>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    // Scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Fetch initial messages
    const fetchInitialMessages = async () => {
        try {
            const response = await fetch(`/quests/bids/${bidId}/messages`);
            if (response.ok) {
                const data = await response.json();
                setMessages(data);
            }
        } catch (error) {
            console.error('Failed to fetch chat messages', error);
        } finally {
            setLoading(false);
        }
    };

    // Poll for new messages
    const pollNewMessages = async (lastId: string) => {
        try {
            const url = lastId
                ? `/quests/bids/${bidId}/messages?after_id=${lastId}`
                : `/quests/bids/${bidId}/messages`;
            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                if (data.length > 0) {
                    setMessages((prev) => {
                        // Prevent duplicates
                        const existingIds = new Set(prev.map((m) => m.id));
                        const filteredNew = data.filter(
                            (m: Message) => !existingIds.has(m.id),
                        );
                        return [...prev, ...filteredNew];
                    });
                }
            }
        } catch (error) {
            console.error('Error polling messages', error);
        }
    };

    useEffect(() => {
        setLoading(true);
        fetchInitialMessages();

        return () => {
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
            }
        };
    }, [bidId]);

    // Setup polling interval once initial messages are loaded or updated
    useEffect(() => {
        if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
        }

        const lastMessageId =
            messages.length > 0 ? messages[messages.length - 1].id : '';

        pollingIntervalRef.current = setInterval(() => {
            pollNewMessages(lastMessageId);
        }, 3000);

        scrollToBottom();

        return () => clearInterval(pollingIntervalRef.current);
    }, [messages]);

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

            const response = await fetch(`/quests/bids/${bidId}/messages`, {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': csrfToken || '',
                    Accept: 'application/json',
                },
                body: formData,
            });

            if (response.ok) {
                const newMsg = await response.json();
                setMessages((prev) => [...prev, newMsg]);
                setNewMessage('');
                setAttachmentFile(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            }
        } catch (error) {
            console.error('Failed to send message', error);
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
        <div className="fixed inset-y-0 right-0 z-50 flex w-full flex-col border-l border-slate-200 bg-white shadow-2xl transition-all duration-300 sm:w-[450px] dark:border-slate-800 dark:bg-[#0d1117]">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 bg-[#f5f6ff] p-4 dark:border-slate-800 dark:bg-[#0d0f17]">
                <div className="flex min-w-0 items-center gap-2.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-650 dark:bg-slate-800 dark:text-indigo-400">
                        <MessageSquare className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                        <h4 className="truncate text-sm font-bold text-slate-900 dark:text-white">
                            {isDisputed ? 'Ruang Mediasi Arbitrase' : targetUserName}
                        </h4>
                        <span className="block truncate text-[10px] text-slate-405 dark:text-slate-500">
                            Proyek: {questTitle}
                        </span>
                    </div>
                </div>

                <button
                    onClick={onClose}
                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-250 dark:text-slate-400 dark:hover:bg-white/5"
                >
                    <X size={18} />
                </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 space-y-4 overflow-y-auto bg-[#f8fafc] p-4 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800 dark:bg-[#030712]">
                {isDisputed && (
                    <div className="flex gap-2.5 rounded-xl border border-amber-100 bg-amber-50/15 p-3.5 text-xs text-amber-800 dark:text-amber-300 dark:border-[#3b4b61]/40 dark:bg-[#0d0f17]">
                        <ShieldAlert className="h-4 w-4 shrink-0 text-amber-550 mt-0.5" />
                        <div className="space-y-0.5">
                            <span className="block font-bold uppercase tracking-wider text-[10px]">Ruang Mediasi</span>
                            <p className="leading-relaxed text-slate-500 dark:text-slate-400 text-[11px]">
                                Admin hadir sebagai mediator resmi untuk menyelesaikan sengketa ini. Silakan lampirkan argumen dan bukti pekerjaan Anda di bawah ini.
                            </p>
                        </div>
                    </div>
                )}
                {loading ? (
                    <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-400">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
                        <span className="text-xs">Memuat obrolan...</span>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center space-y-2 p-6 text-center text-slate-405">
                        <MessageSquare className="h-12 w-12 stroke-1 text-slate-300 dark:text-slate-700" />
                        <h5 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                            Belum Ada Obrolan
                        </h5>
                        <p className="text-xs text-slate-400">
                            Kirim pesan pertama Anda untuk memulai diskusi mengenai proyek ini.
                        </p>
                    </div>
                ) : (
                    messages.map((msg) => {
                        const isSelf =
                            msg.sender.id === currentUser?.id ||
                            msg.sender.id === currentUser?._id;
                        return (
                            <div
                                key={msg.id}
                                className={`flex flex-col ${isSelf ? 'items-end' : 'items-start'}`}
                            >
                                <span className="mb-1 px-1 text-[9px] text-slate-400 flex items-center gap-1">
                                    <span>{isSelf ? 'Anda' : msg.sender.name}</span>
                                    <span>•</span>
                                    {msg.sender.role === 'admin' ? (
                                        <span className="rounded bg-red-50 px-1 py-0.5 text-[8px] font-bold text-red-650 uppercase tracking-wider dark:bg-red-500/10 dark:text-red-400">
                                            Mediator
                                        </span>
                                    ) : msg.sender.id === creatorId || msg.sender._id === creatorId ? (
                                        <span className="rounded bg-blue-50 px-1 py-0.5 text-[8px] font-bold text-blue-650 uppercase tracking-wider dark:bg-blue-500/10 dark:text-blue-400">
                                            Klien
                                        </span>
                                    ) : msg.sender.id === workerId || msg.sender._id === workerId ? (
                                        <span className="rounded bg-emerald-50 px-1 py-0.5 text-[8px] font-bold text-emerald-600 uppercase tracking-wider dark:bg-emerald-500/10 dark:text-emerald-455">
                                            Pekerja
                                        </span>
                                    ) : (
                                        <span className="rounded bg-slate-100 px-1 py-0.5 text-[8px] font-bold text-slate-500 uppercase tracking-wider dark:bg-slate-800 dark:text-slate-400">
                                            Siswa
                                        </span>
                                    )}
                                </span>
                                <div
                                    className={`relative max-w-[85%] rounded-lg px-3 py-2 text-xs shadow-[0_1px_1.5px_rgba(0,0,0,0.1)] ${
                                        isSelf
                                            ? 'rounded-tr-none border border-[#c7d2fe] bg-[#e0e7ff] text-[#1e1b4b] dark:border-[#3b4b61] dark:bg-[#232d3f] dark:text-[#f1f5f9]'
                                            : 'rounded-tl-none border border-slate-200 bg-white text-slate-850 dark:border-[#334155] dark:bg-[#1e293b] dark:text-[#f1f5f9]'
                                    }`}
                                >
                                    {isSelf ? (
                                        <div className="absolute top-[8px] -right-[4px] h-2 w-2 rotate-45 border-t border-r border-[#c7d2fe] bg-[#e0e7ff] dark:border-[#3b4b61] dark:bg-[#232d3f]" />
                                    ) : (
                                        <div className="absolute top-[8px] -left-[4px] h-2 w-2 rotate-45 border-l border-b border-slate-200 bg-white dark:border-[#334155] dark:bg-[#1e293b]" />
                                    )}
                                    {msg.message && (
                                        <p className="relative z-10 leading-relaxed break-words whitespace-pre-wrap">
                                            {msg.message}
                                        </p>
                                    )}

                                    {msg.file && (
                                        <div className={`mt-2 ${msg.message ? 'border-t border-slate-200/50 pt-2 dark:border-slate-800' : ''}`}>
                                            {msg.file.name.match(/\.(jpeg|jpg|gif|png)$/i) ? (
                                                <div className="relative group overflow-hidden rounded border border-slate-200/30 dark:border-slate-800 bg-black/5 dark:bg-black/40 max-w-[240px]">
                                                    <img
                                                        src={msg.file.url}
                                                        alt={msg.file.name}
                                                        className="max-h-40 w-auto object-cover rounded"
                                                    />
                                                    <a
                                                        href={msg.file.url}
                                                        download
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity text-white rounded"
                                                    >
                                                        <Download size={18} />
                                                    </a>
                                                </div>
                                            ) : (
                                                <div className={`flex items-center justify-between gap-3 rounded-lg border p-2 text-xs ${
                                                    isSelf
                                                        ? 'border-[#c7d2fe]/50 bg-white/50 text-[#1e1b4b] dark:border-[#3b4b61]/45 dark:bg-black/20 dark:text-[#f1f5f9]'
                                                        : 'border-slate-200/40 bg-black/5 dark:border-slate-800 dark:bg-black/20 text-slate-800 dark:text-slate-200'
                                                }`}>
                                                    <div className="flex min-w-0 items-center gap-2">
                                                        <FileText className={`h-5 w-5 shrink-0 ${isSelf ? 'text-indigo-600 dark:text-indigo-400' : 'text-indigo-400'}`} />
                                                        <div className="min-w-0">
                                                            <p className={`truncate text-xs font-semibold ${isSelf ? 'text-[#1e1b4b]' : 'text-slate-705 dark:text-slate-200'}`}>
                                                                {msg.file.name}
                                                            </p>
                                                            <p className={`text-[9px] ${isSelf ? 'text-[#1e1b4b]/60 dark:text-[#f1f5f9]/60' : 'text-slate-400'}`}>
                                                                {formatFileSize(msg.file.size)}
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
                                                                : 'bg-indigo-500/10 text-indigo-650 hover:bg-indigo-500/20 dark:text-indigo-400'
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
                    <div className="flex items-center gap-2 min-w-0">
                        <FileText className="h-4 w-4 text-indigo-550 shrink-0" />
                        <span className="truncate font-semibold">{attachmentFile.name}</span>
                        <span className="text-[10px] text-slate-400">({formatFileSize(attachmentFile.size)})</span>
                    </div>
                    <button
                        type="button"
                        onClick={() => setAttachmentFile(null)}
                        className="text-slate-400 hover:text-red-500 cursor-pointer"
                    >
                        <X size={16} />
                    </button>
                </div>
            )}

            {/* Input Area */}
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
                    disabled={(!newMessage.trim() && !attachmentFile) || sending}
                    className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-500/20 transition-all hover:from-indigo-500 hover:to-indigo-600 dark:from-indigo-600 dark:to-indigo-500 dark:hover:from-indigo-500 dark:hover:to-indigo-400 disabled:cursor-not-allowed disabled:opacity-50 active:scale-95"
                >
                    <Send size={16} />
                </button>
            </form>
        </div>
    );
}
