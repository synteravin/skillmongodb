import { usePage } from '@inertiajs/react';
import React, { useEffect, useRef, useState } from 'react';
import { Send, X, MessageSquare, ShieldAlert } from 'lucide-react';

interface Message {
    id: string;
    message: string;
    created_at: string;
    sender: {
        id: string;
        name: string;
        role: string;
    };
}

interface Props {
    bidId: string;
    questTitle: string;
    targetUserName: string;
    onClose: () => void;
}

export default function QuestChatPanel({
    bidId,
    questTitle,
    targetUserName,
    onClose,
}: Props) {
    const { props } = usePage<any>();
    const currentUser = props.auth?.user;

    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const pollingIntervalRef = useRef<any>(null);

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
        if (!newMessage.trim() || sending) return;

        setSending(true);
        try {
            const csrfToken = (
                document.querySelector(
                    'meta[name="csrf-token"]',
                ) as HTMLMetaElement
            )?.content;
            const response = await fetch(`/quests/bids/${bidId}/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken || '',
                    Accept: 'application/json',
                },
                body: JSON.stringify({ message: newMessage }),
            });

            if (response.ok) {
                const newMsg = await response.json();
                setMessages((prev) => [...prev, newMsg]);
                setNewMessage('');
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
        <div className="fixed inset-y-0 right-0 z-50 flex w-full flex-col border-l border-slate-200 bg-white shadow-2xl transition-all duration-300 sm:w-[450px] dark:border-slate-800 dark:bg-[#0c0f19]">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 bg-[#f8fafc] p-4 dark:border-slate-800 dark:bg-[#0f1322]">
                <div className="flex min-w-0 items-center gap-2.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-500/10 font-bold text-indigo-600 dark:text-indigo-400">
                        <MessageSquare className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                        <h4 className="truncate text-sm font-bold text-slate-900 dark:text-white">
                            {targetUserName}
                        </h4>
                        <span className="block truncate text-[10px] text-slate-400 dark:text-slate-500">
                            Quest: {questTitle}
                        </span>
                    </div>
                </div>

                <button
                    onClick={onClose}
                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-white/5"
                >
                    <X size={18} />
                </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50/50 p-4 dark:bg-[#080a10]">
                {loading ? (
                    <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-400">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
                        <span className="text-xs">Memuat obrolan...</span>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center space-y-2 p-6 text-center text-slate-400">
                        <MessageSquare className="h-12 w-12 stroke-1 text-slate-300 dark:text-slate-700" />
                        <h5 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                            Belum Ada Obrolan
                        </h5>
                        <p className="text-xs text-slate-400">
                            Kirim pesan pertama Anda untuk memulai diskusi
                            mengenai pekerjaan freelance ini.
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
                                <span className="mb-1 px-1 text-[9px] text-slate-400">
                                    {isSelf ? 'Anda' : msg.sender.name} •{' '}
                                    {msg.sender.role === 'admin'
                                        ? 'Admin'
                                        : 'Siswa'}
                                </span>
                                <div
                                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                                        isSelf
                                            ? 'rounded-tr-none bg-[#3B28F6] text-white'
                                            : 'rounded-tl-none border border-slate-200 bg-white text-slate-800 dark:border-slate-800 dark:bg-[#121625] dark:text-slate-200'
                                    }`}
                                >
                                    <p className="leading-relaxed break-words whitespace-pre-wrap">
                                        {msg.message}
                                    </p>
                                    <span
                                        className={`mt-1.5 block text-right text-[9px] ${
                                            isSelf
                                                ? 'text-indigo-200'
                                                : 'text-slate-400'
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

            {/* Input Area */}
            <form
                onSubmit={handleSendMessage}
                className="flex items-center gap-2 border-t border-slate-200 bg-[#f8fafc] p-4 dark:border-slate-800 dark:bg-[#0f1322]"
            >
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Tulis pesan..."
                    className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                />
                <button
                    type="submit"
                    disabled={!newMessage.trim() || sending}
                    className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-[#3B28F6] text-white shadow-sm transition-colors hover:bg-[#2a1ce0] disabled:opacity-50"
                >
                    <Send size={16} />
                </button>
            </form>
        </div>
    );
}
