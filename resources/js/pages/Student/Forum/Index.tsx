import React from 'react';
import { Head } from '@inertiajs/react';
import ForumWorkspace from '@/components/Forum/ForumWorkspace';
import {
    CourseGroup,
    Message,
    PinnedMessage,
    User,
} from '@/components/Forum/types';

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
    const activeAuth = auth || (user ? { user } : undefined);

    if (!activeAuth) {
        return null;
    }

    return (
        <>
            <Head
                title={`Forum - ${
                    selectedCourse ? selectedCourse.title : 'Diskusi'
                }`}
            />

            <div className="flex h-dvh w-screen overflow-hidden bg-[#121212] text-white">
                <ForumWorkspace
                    courses={courses}
                    selectedCourse={selectedCourse}
                    messages={messages}
                    pinnedMessages={pinnedMessages}
                    auth={activeAuth}
                />
            </div>
        </>
    );
}
