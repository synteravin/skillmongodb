import React from 'react';
import QuizEditor, { type Question } from '@/components/Quiz/QuizEditor';

type Quiz = {
    id: string;
    path_id?: string;
    module_id?: string;
    difficulty: string;
    duration?: number;
    questions: Question[];
};

export default function Edit({ quiz }: { quiz: Quiz }) {
    return (
        <QuizEditor
            mode="edit"
            role="admin"
            pathId={quiz.path_id}
            initialDifficulty={quiz.difficulty || 'medium'}
            initialDuration={quiz.duration || 15}
            initialQuestions={quiz.questions}
            submitUrl={`/admin/quiz/${quiz.id}`}
            backUrl={quiz.path_id ? `/admin/paths/${quiz.path_id}/modules` : undefined}
        />
    );
}
