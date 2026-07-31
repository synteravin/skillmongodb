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

        $totalEarnedPoints = 0.0;
        $totalQuestions = $quiz->questions()->count();

        foreach ($quiz->questions as $question) {
            $questionId = (string) $question->_id;
            $studentAnswer = $answers[$questionId] ?? null;

            if ($studentAnswer === null) {
                continue;
            }

            // Get correct & wrong answer IDs for this question from DB
            $correctAnswerIds = QuizAnswer::where('question_id', $questionId)
                ->where('is_correct', true)
                ->pluck('_id')
                ->map(fn ($id) => (string) $id)
                ->toArray();

            $wrongAnswerIds = QuizAnswer::where('question_id', $questionId)
                ->where('is_correct', false)
                ->pluck('_id')
                ->map(fn ($id) => (string) $id)
                ->toArray();

            $numCorrectKey = count($correctAnswerIds);
            if ($numCorrectKey === 0) {
                continue;
            }

            // Student selected answer IDs as array of strings
            $studentAnswerIds = is_array($studentAnswer)
                ? array_map('strval', $studentAnswer)
                : [(string) $studentAnswer];

            $studentAnswerIds = array_values(array_unique($studentAnswerIds));

            // Count how many correct & wrong answers student selected
            $numCorrectSelected = count(array_intersect($studentAnswerIds, $correctAnswerIds));
            $numWrongSelected = count(array_intersect($studentAnswerIds, $wrongAnswerIds));

            // Global Best Practice Partial Credit Formula with Wrong Choice Penalty:
            // Fraction = max(0, (numCorrectSelected - numWrongSelected) / numCorrectKey)
            $fraction = max(0.0, ($numCorrectSelected - $numWrongSelected) / $numCorrectKey);

            $totalEarnedPoints += $fraction;
        }

        $total = max($totalQuestions, 1);
        $passingScore = (int) ($quiz->passing_score ?? 75);
        $score = (int) round(($totalEarnedPoints / $total) * 100);
        $passed = $score >= $passingScore;

        return [
            'score' => $score,
            'passed' => $passed,
            'passing_score' => $passingScore,
        ];
    }
}
