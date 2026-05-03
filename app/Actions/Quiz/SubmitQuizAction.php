<?php

namespace App\Actions\Quiz;

use App\Models\Quiz;
use App\Models\QuizResult;
use App\Models\User;
use App\Models\UserStat;
use App\Services\Quiz\QuizService;
use App\Services\Reward\RewardService;

class SubmitQuizAction
{
    public function execute(User $user, Quiz $quiz, array $data): object
    {
        $userId = (string) $user->_id;
        // 🔒 DOUBLE CHECK (ANTI BYPASS)
        $exists = QuizResult::where('user_id', $userId)
            ->where('quiz_id', (string) $quiz->_id)
            ->exists();

        if ($exists) {
            throw new \Exception('Quiz sudah pernah dikerjakan');
        }
        $pathId = (string) $quiz->path_id;

        $service = app(QuizService::class);
        $result = $service->submit($user, $quiz, $data['answers']);

        $score = (int) $result['score'];

        // 🔥 SIMPAN HASIL
        QuizResult::create([
            'user_id' => $userId,
            'quiz_id' => (string) $quiz->_id,
            'score' => $score,
            'answers' => $data['answers'],
            'passed' => true,
            'completed_at' => now(),
        ]);

        // 🔥 AMBIL / BUAT PROGRESS
        $progress = UserStat::firstOrCreate([
            'user_id' => $userId,
            'course_id' => (string) $quiz->path->course_id,
        ]);

        // 🔥 REWARD (HANYA SEKALI)
        $reward = new RewardService;

        $reward->setQuizScore($progress, $pathId, $score);
        $reward->addExp($progress, $pathId, $score);
        $reward->addGold($progress, $pathId, floor($score / 2));

        return (object) [
            'score' => $score,
            'passed' => true,
            'message' => 'Quiz selesai',
            'exp' => $score,
            'gold' => floor($score / 2),
        ];
    }
}
