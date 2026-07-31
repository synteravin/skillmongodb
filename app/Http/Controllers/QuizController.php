<?php

namespace App\Http\Controllers;

use App\Actions\Quiz\SubmitQuizAction;
use App\Http\Requests\Quiz\SubmitQuizRequest;
use App\Models\Quiz;
use App\Models\QuizResult;
use App\Models\UserStat;
use Inertia\Inertia;

class QuizController extends Controller
{
    public function show($id)
    {
        $quiz = Quiz::with(['path.course', 'path.modules', 'questions.answers'])
            ->where('_id', $id)
            ->orWhere('slug', $id)
            ->orWhereHas('path', fn ($q) => $q->where('slug', $id))
            ->firstOrFail();

        $user = auth()->user()->load(['userStats']);

        // 🔒 CEK STATUS KELULUSAN TERLEBIH DAHULU
        $hasPassed = QuizResult::where(function ($q) use ($user) {
            $q->where('user_id', $user->_id)->orWhere('user_id', (string) $user->_id);
        })->where(function ($q) use ($quiz) {
            $q->where('quiz_id', $quiz->_id)->orWhere('quiz_id', (string) $quiz->_id);
        })->where('passed', true)->exists();

        // 🔒 JIKA BELUM LULUS DAN BUKAN ADMIN/MENTOR, VALIDASI PEKERJAAN MODUL
        if (! $hasPassed && ! in_array($user->role, ['admin', 'mentor'])) {
            $progress = UserStat::where(function ($q) use ($user) {
                $q->where('user_id', $user->_id)->orWhere('user_id', (string) $user->_id);
            })->where(function ($q) use ($quiz) {
                $q->where('course_id', $quiz->path->course_id)->orWhere('course_id', (string) $quiz->path->course_id);
            })->first();

            $completedRaw = $progress?->completed_modules ?? [];
            if (is_string($completedRaw)) {
                $completedRaw = json_decode($completedRaw, true) ?? [];
            }
            $completed = array_map('strval', (array) $completedRaw);

            $pathModules = $quiz->path->modules ?? collect();

            if ($pathModules->isNotEmpty()) {
                $allCompleted = $pathModules->every(function ($m) use ($completed) {
                    return in_array((string) $m->_id, $completed) || ($m->slug && in_array($m->slug, $completed));
                });

                if (! $allCompleted) {
                    abort(403, 'Anda harus menyelesaikan semua modul sebelum mengambil kuis ini.');
                }
            }
        }

        // 🔥 Hitung EXP dan Gold untuk Kuis
        $totalExp = 0;
        $totalGold = 0;

        foreach ($user->userStats as $stat) {
            $statExp = 0;
            $statGold = 0;

            if ($stat->path_stats) {
                $pathStats = $stat->path_stats;

                // Normalize Mongo
                if (is_string($pathStats)) {
                    $pathStats = json_decode($pathStats, true);
                } elseif (is_object($pathStats)) {
                    $pathStats = json_decode(json_encode($pathStats), true);
                }

                foreach ($pathStats as $value) {
                    $item = (array) $value;

                    $statExp += $item['exp'] ?? 0;
                    $statGold += $item['gold'] ?? 0;
                }
            }

            $totalExp += max((int) ($stat->exp ?? 0), $statExp);
            $totalGold += max((int) ($stat->gold ?? 0), $statGold);
        }

        $expPerLevel = 500;
        $currentLevel = floor($totalExp / $expPerLevel) + 1;
        $currentExp = $totalExp % $expPerLevel;

        $user = auth()->user();
        $character = $user->character;

        return Inertia::render('Student/Quiz/Play', [
            'character' => $character ? [
                'name' => $character->name,
                'avatar' => $character->avatar_url,
            ] : null,
            'has_submitted' => $hasPassed,
            'user_stats' => [
                'level' => $currentLevel,
                'xp' => $currentExp,
                'exp_max' => $expPerLevel,
                'gold' => $totalGold,
            ],
            'quiz' => [
                'id' => (string) ($quiz->slug ?: $quiz->path->slug ?: $quiz->_id),
                'difficulty' => $quiz->difficulty,
                'course_slug' => $quiz->path->course->slug,
                'questions' => $quiz->questions->map(fn ($q) => [
                    'id' => (string) $q->_id,
                    'question_text' => $q->question_text,
                    'media_url' => $q->media_url
                        ? (str_starts_with($q->media_url, 'http') ? $q->media_url : url('storage/'.$q->media_url))
                        : null,
                    'max_selectable' => max(1, $q->answers->where('is_correct', true)->count()),
                    'answers' => $q->answers->map(fn ($a) => [
                        'id' => (string) $a->_id,
                        'answer_text' => $a->answer_text,
                    ]),
                ]),
            ],
        ]);
    }

    public function submit(SubmitQuizRequest $request, $id)
    {
        try {
            $quiz = Quiz::with(['questions.answers', 'path'])
                ->where('slug', $id)
                ->orWhere('_id', $id)
                ->orWhereHas('path', fn ($q) => $q->where('slug', $id))
                ->firstOrFail();

            $user = auth()->user();

            // 🔒 CEK APAKAH SUDAH LULUS (JIKA SUDAH LULUS, TIDAK BISA SUBMIT LAGI)
            $alreadyPassed = QuizResult::where('user_id', (string) $user->_id)
                ->where('quiz_id', (string) $quiz->_id)
                ->where('passed', true)
                ->exists();

            if ($alreadyPassed) {
                return response()->json([
                    'message' => 'Quiz ini sudah Anda selesaikan dengan lulus.',
                ], 403);
            }

            // lanjut eksekusi
            $result = app(SubmitQuizAction::class)
                ->execute($user, $quiz, $request->validated());

            if ($result->passed) {
                $progress = UserStat::firstOrCreate([
                    'user_id' => $user->_id,
                    'course_id' => $quiz->path->course_id,
                ]);

                $completedPaths = $progress->completed_paths ?? [];

                if (is_string($completedPaths)) {
                    $completedPaths = json_decode($completedPaths, true) ?? [];
                }

                if (! in_array((string) $quiz->path->_id, $completedPaths)) {
                    $completedPaths[] = (string) $quiz->path->_id;

                    $progress->update([
                        'completed_paths' => $completedPaths,
                    ]);
                }
            }

            return response()->json([
                'result' => [
                    'score' => (int) $result->score,
                    'passed' => (bool) $result->passed,
                    'exp' => (int) $result->exp,
                    'gold' => (int) $result->gold,
                ],
            ]);

        } catch (\Throwable $e) {
            return response()->json([
                'error' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile(),
            ], 500);
        }
    }
}
