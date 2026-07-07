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

export default function QuestChatPanel({ bidId, questTitle, targetUserName, onClose }: Props) {
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
                        const existingIds = new Set(prev.map(m => m.id));
                        const filteredNew = data.filter((m: Message) => !existingIds.has(m.id));
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

        const lastMessageId = messages.length > 0 ? messages[messages.length - 1].id : '';
        
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
            const csrfToken = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content;
            const response = await fetch(`/quests/bids/${bidId}/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken || '',
                    'Accept': 'application/json',
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
        <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[450px] bg-white dark:bg-[#0c0f19] border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col transition-all duration-300">
            {/* Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-[#f8fafc] dark:bg-[#0f1322] flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold shrink-0">
                        <MessageSquare className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                            {targetUserName}
                        </h4>
                        <span className="block text-[10px] text-slate-400 dark:text-slate-500 truncate">
                            Quest: {questTitle}
                        </span>
                    </div>
                </div>

                <button
                    onClick={onClose}
                    className="w-8 h-8 rounded-lg hover:bg-slate-200 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400 flex items-center justify-center transition-colors cursor-pointer"
                >
                    <X size={18} />
                </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-[#080a10]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2">
                        <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                        <span className="text-xs">Memuat obrolan...</span>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400 p-6 text-center space-y-2">
                        <MessageSquare className="w-12 h-12 stroke-1 text-slate-300 dark:text-slate-700" />
                        <h5 className="font-bold text-sm text-slate-700 dark:text-slate-300">Belum Ada Obrolan</h5>
                        <p className="text-xs text-slate-400">
                            Kirim pesan pertama Anda untuk memulai diskusi mengenai pekerjaan freelance ini.
                        </p>
                    </div>
                ) : (
                    messages.map((msg) => {
                        const isSelf = msg.sender.id === currentUser?.id || msg.sender.id === currentUser?._id;
                        return (
                            <div
                                key={msg.id}
                                className={`flex flex-col ${isSelf ? 'items-end' : 'items-start'}`}
                            >
                                <span className="text-[9px] text-slate-400 mb-1 px-1">
                                    {isSelf ? 'Anda' : msg.sender.name} • {msg.sender.role === 'admin' ? 'Admin' : 'Siswa'}
                                </span>
                                <div
                                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                                        isSelf
                                            ? 'bg-[#3B28F6] text-white rounded-tr-none'
                                            : 'bg-white dark:bg-[#121625] border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none'
                                    }`}
                                >
                                    <p className="leading-relaxed break-words whitespace-pre-wrap">{msg.message}</p>
                                    <span
                                        className={`block text-[9px] text-right mt-1.5 ${
                                            isSelf ? 'text-indigo-200' : 'text-slate-400'
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
                className="p-4 border-t border-slate-200 dark:border-slate-800 bg-[#f8fafc] dark:bg-[#0f1322] flex items-center gap-2"
            >
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Tulis pesan..."
                    className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white"
                />
                <button
                    type="submit"
                    disabled={!newMessage.trim() || sending}
                    className="w-10 h-10 rounded-xl bg-[#3B28F6] hover:bg-[#2a1ce0] text-white flex items-center justify-center shadow-sm disabled:opacity-50 transition-colors cursor-pointer shrink-0"
                >
                    <Send size={16} />
                </button>
            </form>
        </div>
    );
}
