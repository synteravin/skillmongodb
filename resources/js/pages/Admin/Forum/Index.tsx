import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import ForumWorkspace from '@/components/Forum/ForumWorkspace';
import {
    CourseGroup,
    Message,
    PinnedMessage,
    SelectedCourse,
} from '@/components/Forum/types';

interface Props {
    courses: CourseGroup[];
    selectedCourse: SelectedCourse | null;
    messages: Message[];
    pinnedMessages: PinnedMessage[];
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
