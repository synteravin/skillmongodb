<?php

namespace App\Services\Quiz;

use App\Models\Quiz;
use App\Models\User;
use App\Models\QuizAnswer;

class QuizService
{
    public function submit(User $user, Quiz $quiz, array $answers): array
    {
        if (empty($answers)) {
            return [
                'score' => 0,
                'passed' => true
            ];
        }

        $correct = 0;
        $total = count($answers);

        foreach ($answers as $questionId => $answerId) {

            $answer = QuizAnswer::find($answerId);

            if (!$answer) {
                continue;
            }

            // 🔥 VALIDASI: pastikan answer milik question itu
            if ((string) $answer->question_id !== (string) $questionId) {
                continue;
            }

            // 🔥 HANDLE SEMUA FORMAT DATA
            $val = strtolower(trim((string) $answer->is_correct));

            if (in_array($val, ['1', 'true'], true)) {
                $correct++;
            }
        }

        $score = round(($correct / $total) * 100);

        return [
            'score' => $score,
            'passed' => true
        ];
    }
}