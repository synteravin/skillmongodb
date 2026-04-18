<?php

namespace App\Services\Quiz;

use App\Models\Quiz;
use App\Models\User;

class QuizService
{
    public function submit(User $user, Quiz $quiz, array $answers): array
    {
        $questions = $quiz->questions()->with('answers')->get();

        $correct = 0;
        $total = $questions->count();

        if ($total === 0) {
            return [
                'score' => 0,
                'passed' => true
            ];
        }

        foreach ($questions as $question) {

            $questionId = (string) $question->_id;

            $userAnswerId = $answers[$questionId] ?? null;

            if (!$userAnswerId)
                continue;

            $isCorrect = $question->answers->contains(function ($answer) use ($userAnswerId) {
                return (string) $answer->_id === (string) $userAnswerId
                    && (bool) $answer->is_correct;
            });

            if ($isCorrect) {
                $correct++;
            }
        }

        $score = round(($correct / $total) * 100);

        return [
            'score' => $score,
            'passed' => true // 🔥 no fail system
        ];
    }
}