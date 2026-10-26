import React from 'react';
import QuizEditor, { type Question } from '@/components/Quiz/QuizEditor';

export default function Create({
    pathId,
    quiz,
}: {
    pathId: string;
    quiz?: {
        id: string;
        difficulty: string;
        duration?: number;
        questions: Question[];
    } | null;
}) {
    return (
        <QuizEditor
            mode="create"
            role="admin"
            pathId={pathId}
            initialDifficulty={quiz?.difficulty || 'medium'}
            initialDuration={quiz?.duration || 15}
            initialQuestions={quiz?.questions}
            submitUrl={`/admin/paths/${pathId}/quiz`}
            backUrl={`/admin/paths/${pathId}/modules`}
        />
    );
}
