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

        // 🔒 CEK ATAU CEK JIKA SUDAH LULUS (ANTI BYPASS)
        $alreadyPassed = QuizResult::where('user_id', $userId)
            ->where('quiz_id', (string) $quiz->_id)
            ->where('passed', true)
            ->exists();

        if ($alreadyPassed) {
            throw new \Exception('Quiz ini sudah Anda selesaikan dengan lulus.');
        }

        $pathId = (string) $quiz->path_id;

        $service = app(QuizService::class);
        $result = $service->submit($user, $quiz, $data['answers']);

        $score = (int) $result['score'];
        $passed = (bool) $result['passed'];

        // 🔥 SIMPAN / UPDATE HASIL QUIZ
        QuizResult::updateOrCreate(
            [
                'user_id' => $userId,
                'quiz_id' => (string) $quiz->_id,
            ],
            [
                'score' => $score,
                'answers' => $data['answers'],
                'passed' => $passed,
                'completed_at' => now(),
            ]
        );

        if ($passed) {
            // 🔥 AMBIL / BUAT PROGRESS
            $progress = UserStat::firstOrCreate([
                'user_id' => $userId,
                'course_id' => (string) $quiz->path->course_id,
            ]);

            // 🔥 REWARD HANYA SAAT LULUS (SEKALI SAJA)
            $reward = new RewardService;
            $reward->setQuizScore($progress, $pathId, $score);
            $reward->addExp($progress, $pathId, $score);
            $reward->addGold($progress, $pathId, (int) floor($score / 2));

            return (object) [
                'score' => $score,
                'passed' => true,
                'message' => 'Selamat, Anda lulus quiz!',
                'exp' => $score,
                'gold' => (int) floor($score / 2),
            ];
        }

        // ⚠️ JIKA GAGAL (SCORE < 75%)
        return (object) [
            'score' => $score,
            'passed' => false,
            'message' => 'Nilai Anda belum mencapai batas kelulusan (75%). Silakan coba lagi!',
            'exp' => 0,
            'gold' => 0,
        ];
    }
}
