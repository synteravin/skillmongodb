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

        // 🚫 SUDAH PERNAH SUBMIT
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
            'passed' => (bool) $result['passed'],
            'completed_at' => now()
        ]);

        return (object) [
            'score' => (int) $result['score'],
            'passed' => (bool) $result['passed'],
            'message' => 'Quiz berhasil disubmit'
        ];
    }
}