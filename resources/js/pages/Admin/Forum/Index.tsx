import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import ForumWorkspace from '@/components/Forum/ForumWorkspace';

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

const breadcrumbs = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Forum Diskusi', href: '/admin/forum' },
];

export default function Index({
    courses,
    selectedCourse,
    messages,
    pinnedMessages,
    auth,
}: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Forum Diskusi" />
            <div className="flex h-[calc(100dvh_-_3.5rem)] flex-1 flex-col space-y-4 overflow-hidden p-4 md:h-full md:p-6">
                <div className="relative min-h-0 flex-1 overflow-hidden rounded-2xl">
                    <ForumWorkspace
                        courses={courses}
                        selectedCourse={selectedCourse}
                        messages={messages}
                        pinnedMessages={pinnedMessages}
                        auth={auth}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
