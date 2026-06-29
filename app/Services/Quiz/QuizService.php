<?php

namespace App\Services\Quiz;

use App\Models\Quiz;
use App\Models\QuizAnswer;
use App\Models\User;

class QuizService
{
    public function submit(User $user, Quiz $quiz, array $answers): array
    {
        if (empty($answers)) {
            return [
                'score' => 0,
                'passed' => false,
                'passing_score' => (int) ($quiz->passing_score ?? 75),
            ];
        }

        $correct = 0;
        $total = count($answers);

        foreach ($answers as $questionId => $answerId) {
            $answer = QuizAnswer::find($answerId);

            if (! $answer) {
                continue;
            }

            if ((string) $answer->question_id !== (string) $questionId) {
                continue;
            }

            $val = strtolower(trim((string) $answer->is_correct));

            if (in_array($val, ['1', 'true'], true)) {
                $correct++;
            }
        }

        $passingScore = (int) ($quiz->passing_score ?? 75);
        $score = $total > 0 ? (int) round(($correct / $total) * 100) : 0;
        $passed = $score >= $passingScore;

        return [
            'score' => $score,
            'passed' => $passed,
            'passing_score' => $passingScore,
        ];
    }
}
