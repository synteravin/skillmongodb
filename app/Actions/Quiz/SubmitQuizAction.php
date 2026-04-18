<?php

namespace App\Actions\Quiz;

use App\Models\Quiz;
use App\Models\User;
use App\Models\QuizResult;
use App\Services\Quiz\QuizService;

class SubmitQuizAction
{
    public function execute(User $user, Quiz $quiz, array $data): object
    {
        $userId = $user->id ?? $user->_id;

        $existing = QuizResult::where('quiz_id', $quiz->_id)
            ->where('user_id', $userId)
            ->first();

        if ($existing) {
            return (object) [
                'score' => (int) $existing->score,
                'passed' => (bool) $existing->passed,
                'message' => 'Quiz sudah dikerjakan'
            ];
        }

        $service = app(QuizService::class);

        $result = $service->submit($user, $quiz, $data['answers']);

        QuizResult::create([
            'user_id' => $userId,
            'quiz_id' => $quiz->_id,
            'score' => (int) $result['score'],
            'answers' => $data['answers'],
            'passed' => true,
            'completed_at' => now()
        ]);

        return (object) [
            'score' => (int) $result['score'],
            'passed' => true,
            'message' => 'Quiz berhasil'
        ];
    }
}