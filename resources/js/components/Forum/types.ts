export interface Sender {
    id: string;
    name: string;
    avatar: string | null;
    role: string;
}

export interface Message {
    id: string;
    message: string | null;
    attachments: string[];
    created_at: string;
    sender: Sender;
    parent?: {
        id: string;
        message: string;
        sender_name: string;
        sender_id?: string;
    } | null;
    reactions: Array<{
        user_id: string;
        user_name: string;
        emoji: string;
    }>;
    is_pinned?: boolean;
}

export interface PinnedMessage {
    id: string;
    message: string;
    sender_name: string;
}

export interface CourseGroup {
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

export interface SelectedCourse {
    id: string;
    title: string;
    slug: string;
    thumbnail: string | null;
}

export interface User {
    id?: string;
    _id?: string;
    name: string;
    avatar?: string | null;
    role: string;
    email?: string;
}

export interface SelectedProfile {
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
}
