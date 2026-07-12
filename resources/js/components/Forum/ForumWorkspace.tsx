import React, { useEffect, useRef, useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import ConfirmModal from '@/components/ConfirmModal';
import { useAppearance } from '@/hooks/use-appearance';

// Import Types
import {
    Sender,
    Message,
    PinnedMessage,
    CourseGroup,
    SelectedCourse,
    User,
    SelectedProfile,
} from './types';

// Import Subcomponents
import ForumSidebar from './ForumSidebar';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import UserProfileModal from './UserProfileModal';
import ImagePreviewModal from './ImagePreviewModal';
import ChatHeader from './ChatHeader';
import PinnedMessageBar from './PinnedMessageBar';
import EmptyState from './EmptyState';

interface ForumWorkspaceProps {
    courses: CourseGroup[];
    selectedCourse: SelectedCourse | null;
    messages: Message[];
    pinnedMessages: PinnedMessage[];
    auth: {
        user: User;
    };
}

const formatHeaderDate = (isoString: string) => {
    try {
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
    } catch {
        return '';
    }
};

const quickReactions = ['👍', '❤️', '😂', '😮', '😢', '🙏'];

export default function ForumWorkspace({
    courses = [],
    selectedCourse,
    messages = [],
    pinnedMessages = [],
    auth,
}: ForumWorkspaceProps) {
    const currentUser = auth.user;
    const currentUserId = currentUser.id || currentUser._id || '';
    const isMentorOrAdmin =
        currentUser.role === 'mentor' || currentUser.role === 'admin';

    const { resolvedAppearance } = useAppearance();
    const isDark = resolvedAppearance === 'dark';

    const [localMessages, setLocalMessages] = useState<Message[]>(messages);
    const [searchQuery, setSearchQuery] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // Responsive toggle: set true jika di sub-rute course
    const [showChatMobile, setShowChatMobile] = useState(() => {
        if (typeof window !== 'undefined') {
            const pathParts = window.location.pathname
                .split('/')
                .filter(Boolean);
            return pathParts.length > 2 && pathParts[2] !== '';
        }
        return false;
    });

    // Premium states
    const [replyingTo, setReplyingTo] = useState<Message | null>(null);
    const [editingMessage, setEditingMessage] = useState<Message | null>(null);
    const [activeMenuMessageId, setActiveMenuMessageId] = useState<string | null>(null);
    const [showReactionPickerId, setShowReactionPickerId] = useState<string | null>(null);

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [messageIdToDelete, setMessageIdToDelete] = useState<string | null>(null);

    // User Profile Modal states
    const [profileModalOpen, setProfileModalOpen] = useState(false);
    const [profileLoading, setProfileLoading] = useState(false);
    const [selectedProfile, setSelectedProfile] = useState<SelectedProfile | null>(null);

    // Lightbox image preview state
    const [previewImage, setPreviewImage] = useState<{ url: string; msg: Message } | null>(null);

    const chatEndRef = useRef<HTMLDivElement | null>(null);
    const messageRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

    // Dynamic base route path & dashboard route
    const basePath = `/${currentUser.role}/forum`;

    const getDashboardRoute = () => {
        if (currentUser.role === 'admin') return '/admin/dashboard';
        if (currentUser.role === 'mentor') return '/mentor/dashboard';
        return '/student/dashboard';
    };

    // Form Inertia
    const { data, setData, post, processing, reset, errors } = useForm<{
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
        setEditingMessage(null);
        setTimeout(scrollToBottom, 100);
    }, [messages]);

    // Polling real-time ringan
    useEffect(() => {
        if (!selectedCourse) return;

        let isMounted = true;
        const interval = setInterval(() => {
            const lastMsg = localMessages[localMessages.length - 1];
            const lastId = lastMsg ? lastMsg.id : '';

            fetch(`${basePath}/${selectedCourse.slug}/messages?after_id=${lastId}`)
                .then((res) => {
                    if (res.status === 200) {
                        return res.json();
                    }
                    throw new Error('Gagal memuat pesan baru');
                })
                .then((newMsgs: Message[]) => {
                    if (isMounted && newMsgs && newMsgs.length > 0) {
                        setLocalMessages((prev) => {
                            const existingIds = new Set(prev.map((m) => m.id));
                            const filteredNew = newMsgs.filter(
                                (m) => !existingIds.has(m.id)
                            );
                            if (filteredNew.length === 0) return prev;
                            const merged = [...prev, ...filteredNew];
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
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [activeMenuMessageId, showReactionPickerId]);

    // Handle kirim pesan
    const handleSendMessage = (e?: React.FormEvent) => {
        if (e) {
            e.preventDefault();
        }
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
                        setData((prev) => ({
                            ...prev,
                            message: '',
                        }));
                    },
                    onError: (errors: any) => {
                        console.error('Gagal mengedit pesan:', errors);
                    },
                }
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
                    'scale-[1.02]'
                );
                setTimeout(() => {
                    bubble.classList.remove(
                        'ring-4',
                        'ring-[#facc15]/70',
                        'scale-[1.02]'
                    );
                }, 1500);
            }
        }
    };

    // API reaksi emoji (Optimistik + Inertia)
    const handleToggleReaction = (messageId: string, emoji: string) => {
        setLocalMessages((prev) =>
            prev.map((m) => {
                if (m.id === messageId) {
                    const reactions = [...(m.reactions || [])];
                    const foundIndex = reactions.findIndex(
                        (r) => r.user_id === currentUserId
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
                            user_id: currentUserId,
                            user_name: currentUser.name,
                            emoji: emoji,
                        });
                    }
                    return { ...m, reactions };
                }
                return m;
            })
        );
        setActiveMenuMessageId(null);

        router.post(
            `${basePath}/messages/${messageId}/reaction`,
            { emoji },
            {
                preserveState: true,
                preserveScroll: true,
                only: ['messages'],
            }
        );
    };

    // API 
    //  (pin) pesan (Optimistik + Inertia)
    const handleTogglePin = (messageId: string) => {
        setLocalMessages((prev) =>
            prev.map((m) => {
                if (m.id === messageId) {
                    return { ...m, is_pinned: !m.is_pinned };
                }
                return m;
            })
        );
        setActiveMenuMessageId(null);

        router.post(
            `${basePath}/messages/${messageId}/pin`,
            {},
            {
                preserveState: true,
                preserveScroll: true,
                only: ['messages', 'pinnedMessages'],
            }
        );
    };

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
            message: msg.message || '',
        }));
        setReplyingTo(null);
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
        router.delete(`${basePath}/messages/${messageIdToDelete}`, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setActiveMenuMessageId(null);
                setMessageIdToDelete(null);
            },
            onError: (errors: any) => {
                console.error('Gagal menghapus pesan:', errors);
            },
        });
    };

    const handleShowProfile = (userId: string) => {
        setProfileLoading(true);
        setProfileModalOpen(true);
        fetch(`${basePath}/user/${userId}/profile`)
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

    return (
        <div
            className="flex h-full w-full overflow-hidden bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-[#121212] dark:text-white min-w-0"
        >
            {/* Sidebar Kiri */}
            <ForumSidebar
                courses={courses}
                selectedCourse={selectedCourse}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                showChatMobile={showChatMobile}
                setShowChatMobile={setShowChatMobile}
                basePath={basePath}
                dashboardRoute={getDashboardRoute()}
                role={currentUser.role}
                isDark={isDark}
            />

            {/* Area Chat Utama */}
            <div

                className={`flex flex-1 flex-col bg-[#f8fafc] dark:bg-[#0f0e0e] transition-colors duration-300 animate-fade-in min-w-0 ${
                    showChatMobile ? 'flex' : 'hidden lg:flex'

                }`}
            >
                {selectedCourse ? (
                    <>
                        <ChatHeader
                            selectedCourse={selectedCourse}
                            basePath={basePath}
                            setShowChatMobile={setShowChatMobile}
                            role={currentUser.role}
                        />

                        <PinnedMessageBar
                            pinnedMessages={pinnedMessages}
                            scrollToMessage={scrollToMessage}
                        />

                        {/* Feed Chat Area */}
                        <div className={`flex flex-col bg-radial-gradient flex-1 overflow-y-auto overflow-x-hidden from-indigo-950/5 via-transparent to-transparent px-3 py-3 ${
                            isMentorOrAdmin 
                                ? 'md:px-3 md:py-3 lg:px-4 lg:py-4 xl:px-4 xl:py-4 wa-scrollbar' 
                                : 'md:px-4 md:py-5 lg:px-6 lg:py-6'
                        }`}>
                            {localMessages.length === 0 ? (
                                <EmptyState type="no-messages" />
                            ) : (
                                localMessages.map((msg, index) => {
                                    const isConsecutive = (() => {
                                        if (index === 0) return false;
                                        const prevMsg = localMessages[index - 1];
                                        if (prevMsg.sender.role === 'system') return false;
                                        if (prevMsg.sender.id !== msg.sender.id) return false;
                                        try {
                                            const timeDiff =
                                                new Date(msg.created_at).getTime() -
                                                new Date(prevMsg.created_at).getTime();
                                            if (timeDiff > 5 * 60 * 1000) return false;
                                        } catch (e) {}
                                        return true;
                                    })();

                                    const showDateDivider =
                                        index === 0 ||
                                        new Date(
                                            localMessages[index - 1].created_at
                                        ).toDateString() !==
                                            new Date(msg.created_at).toDateString();

                                    return (
                                        <React.Fragment key={msg.id}>
                                          
                                            {showDateDivider && (
                                                <div className="my-4 flex justify-center">
                                                    <span className={`rounded-xs border border-slate-200 bg-slate-200/60 px-3 py-1 font-['Oxanium'] text-[10px] font-bold tracking-wider text-slate-700 uppercase animate-fade-in ${
                                                        isMentorOrAdmin
                                                            ? 'dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-400'
                                                            : 'dark:border-[#3B28F6]/10 dark:bg-black/40 dark:text-[#facc15]'
                                                    }`}>
                                                        {formatHeaderDate(msg.created_at)}
                                                    </span>
                                                </div>
                                            )}

                                            <MessageBubble
                                                domRef={(el) => {
                                                    messageRefs.current[msg.id] = el;
                                                }}
                                                msg={msg}
                                                currentUserId={currentUserId}
                                                isMentorOrAdmin={isMentorOrAdmin}
                                                isDark={isDark}
                                                isConsecutive={isConsecutive}
                                                activeMenuMessageId={activeMenuMessageId}
                                                setActiveMenuMessageId={setActiveMenuMessageId}
                                                showReactionPickerId={showReactionPickerId}
                                                setShowReactionPickerId={setShowReactionPickerId}
                                                handleToggleReaction={handleToggleReaction}
                                                handleReplyTo={handleReplyTo}
                                                handleStartEdit={handleStartEdit}
                                                handleTogglePin={handleTogglePin}
                                                handleDeleteMessage={handleDeleteMessage}
                                                handleShowProfile={handleShowProfile}
                                                setPreviewImage={setPreviewImage}
                                                scrollToMessage={scrollToMessage}
                                                quickReactions={quickReactions}
                                            />
                                        </React.Fragment>
                                    );
                                })
                            )}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Input Row Form */}
                        <MessageInput
                            data={data}
                            setData={setData}
                            processing={processing}
                            onSubmit={handleSendMessage}
                            replyingTo={replyingTo}
                            onCancelReply={cancelReply}
                            editingMessage={editingMessage}
                            onCancelEdit={cancelEdit}
                            imagePreview={imagePreview}
                            setImagePreview={setImagePreview}
                            errors={errors}
                            isMentorOrAdmin={isMentorOrAdmin}
                        />
                    </>
                ) : (
                    <EmptyState type="no-course-selected" />
                )}
            </div>

            {/* ConfirmModal for delete */}
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
            <UserProfileModal
                open={profileModalOpen}
                loading={profileLoading}
                profile={selectedProfile}
                onClose={() => {
                    setProfileModalOpen(false);
                    setSelectedProfile(null);
                }}
            />

            {/* Image Preview Lightbox Modal */}
            <ImagePreviewModal
                previewImage={previewImage}
                onClose={() => setPreviewImage(null)}
                messages={localMessages}
                currentUserId={currentUserId}
                isMentorOrAdmin={isMentorOrAdmin}
                handleToggleReaction={handleToggleReaction}
                handleReplyTo={handleReplyTo}
                handleStartEdit={handleStartEdit}
                handleTogglePin={handleTogglePin}
                handleDeleteMessage={handleDeleteMessage}
                quickReactions={quickReactions}
                groupReactions={groupReactions}
            />
        </div>
    );
}
