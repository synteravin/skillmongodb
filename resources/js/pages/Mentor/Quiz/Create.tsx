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
            role="mentor"
            pathId={pathId}
            initialDifficulty={quiz?.difficulty || 'medium'}
            initialDuration={quiz?.duration || 15}
            initialQuestions={quiz?.questions}
            submitUrl={`/mentor/paths/${pathId}/quiz`}
        />
    );
}
