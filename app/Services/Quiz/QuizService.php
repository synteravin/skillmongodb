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
                'passed' => false
            ];
        }

        foreach ($questions as $question) {
            $userAnswer = collect($answers)
                ->firstWhere('question_id', (string) $question->_id);

            if (!$userAnswer)
                continue;

            $isCorrect = $question->answers
                ->filter(function ($answer) use ($userAnswer) {
                    return (string) $answer->_id === (string) $userAnswer['answer_id']
                        && (bool) $answer->is_correct;
                })
                ->isNotEmpty();

            if ($isCorrect) {
                $correct++;
            }
        }

        // 🔥 SCORE DINAMIS
        $scorePerQuestion = 100 / $total;
        $score = round($correct * $scorePerQuestion);

        $passed = $score >= 70;

        return [
            'score' => $score,
            'passed' => $passed
        ];
    }
}