<?php

namespace App\Http\Controllers;

use App\Actions\Quiz\SubmitQuizAction;
use App\Http\Requests\Quiz\SubmitQuizRequest;
use App\Models\Course;
use App\Models\Path;
use App\Models\Quiz;
use App\Models\QuizAttempt;
use App\Models\QuizResult;
use App\Models\User;
use App\Models\UserStat;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class QuizController extends Controller
{
    public function show(string $courseParam, string $pathParam)
    {
        $course = Course::where('slug', $courseParam)->orWhere('_id', $courseParam)->first();
        $courseId = $course ? (string) $course->_id : $courseParam;

        $path = Path::where(function ($q) use ($pathParam) {
            $q->where('slug', $pathParam)->orWhere('_id', $pathParam);
        })->where('course_id', $courseId)->firstOrFail();

        $quiz = Quiz::with(['path.course', 'path.modules', 'questions.answers'])
            ->where(function ($q) use ($path) {
                $q->where('path_id', (string) $path->_id)
                    ->orWhere('path_id', $path->_id);
            })
            ->firstOrFail();

        return $this->renderQuizPlay($quiz);
    }

    public function restart(string $courseParam, string $pathParam)
    {
        /** @var User $user */
        $user = Auth::user();
        $userId = (string) $user->_id;

        $course = Course::where('slug', $courseParam)->orWhere('_id', $courseParam)->first();
        $courseId = $course ? (string) $course->_id : $courseParam;

        $path = Path::where(function ($q) use ($pathParam) {
            $q->where('slug', $pathParam)->orWhere('_id', $pathParam);
        })->where('course_id', $courseId)->firstOrFail();

        $quiz = Quiz::where('path_id', (string) $path->_id)
            ->orWhere('path_id', $path->_id)
            ->firstOrFail();
        $quizId = (string) $quiz->_id;

        QuizAttempt::where('user_id', $userId)
            ->where('quiz_id', $quizId)
            ->where('is_active', true)
            ->update([
                'is_active' => false,
                'completed_at' => now(),
            ]);

        QuizAttempt::create([
            'user_id' => $userId,
            'quiz_id' => $quizId,
            'started_at' => now(),
            'is_active' => true,
        ]);

        $durationSeconds = ((int) ($quiz->duration ?? 15)) * 60;

        return response()->json([
            'remaining_seconds' => $durationSeconds,
        ]);
    }

    public function showLegacy(string $id)
    {
        /** @var User $user */
        $user = Auth::user();

        $query = Quiz::with(['path.course', 'path.modules', 'questions.answers']);

        if (preg_match('/^[a-f\d]{24}$/i', $id)) {
            $quiz = $query->where('_id', $id)->first();
        } else {
            $quizzes = $query->where(function ($q) use ($id) {
                $q->where('slug', $id)->orWhereHas('path', fn ($p) => $p->where('slug', $id));
            })->get();

            if ($quizzes->count() === 1) {
                $quiz = $quizzes->first();
            } elseif ($quizzes->count() > 1 && $user) {
                $userCourseIds = UserStat::where(function ($q) use ($user) {
                    $q->where('user_id', $user->_id)->orWhere('user_id', (string) $user->_id);
                })->pluck('course_id')->map(fn ($cid) => (string) $cid)->toArray();

                $quiz = $quizzes->first(function ($q) use ($userCourseIds) {
                    return $q->path && in_array((string) $q->path->course_id, $userCourseIds);
                }) ?? $quizzes->first();
            } else {
                $quiz = $quizzes->first();
            }
        }

        if (! $quiz || ! $quiz->path || ! $quiz->path->course) {
            abort(404, 'Kuis tidak ditemukan.');
        }

        return redirect()->route('quiz.show', [
            'course' => $quiz->path->course->slug ?: (string) $quiz->path->course->_id,
            'path' => $quiz->path->slug ?: (string) $quiz->path->_id,
        ]);
    }

    private function renderQuizPlay(Quiz $quiz)
    {
        /** @var User $user */
        $user = Auth::user();
        if ($user) {
            $user->load(['userStats']);
        }

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

            $pathModules = ($quiz->path->modules ?? collect())
                ->filter(fn ($m) => $m->is_published !== false);

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

        /** @var User $user */
        $user = Auth::user();
        $character = $user->character;

        $firstModule = $quiz->path->modules->first();

        // 🔍 Fetch student's latest quiz result submission
        $lastResult = QuizResult::where(function ($q) use ($user) {
            $q->where('user_id', $user->_id)->orWhere('user_id', (string) $user->_id);
        })->where(function ($q) use ($quiz) {
            $q->where('quiz_id', $quiz->_id)->orWhere('quiz_id', (string) $quiz->_id);
        })->latest('completed_at')->latest('updated_at')->latest('_id')->first();

        $userAnswersMap = [];
        if ($lastResult && ! empty($lastResult->answers)) {
            $userAnswersMap = is_array($lastResult->answers) ? $lastResult->answers : json_decode($lastResult->answers, true);
        }

        $isReview = request()->boolean('review') || request()->query('review') === '1' || request()->query('mode') === 'review';
        $userId = (string) $user->_id;
        $quizId = (string) $quiz->_id;

        $durationMinutes = (int) ($quiz->duration ?? 15);
        $durationSeconds = $durationMinutes * 60;
        $remainingSeconds = $durationSeconds;

        if (! $isReview && ! $hasPassed) {
            $attempt = QuizAttempt::where('user_id', $userId)
                ->where('quiz_id', $quizId)
                ->where('is_active', true)
                ->latest('started_at')
                ->first();

            if (! $attempt) {
                $attempt = QuizAttempt::create([
                    'user_id' => $userId,
                    'quiz_id' => $quizId,
                    'started_at' => now(),
                    'is_active' => true,
                ]);
            }

            $elapsedSeconds = (int) abs(now()->diffInSeconds($attempt->started_at));
            $remainingSeconds = max(0, $durationSeconds - $elapsedSeconds);
        } else {
            $remainingSeconds = 0;
        }

        $totalQuestions = $quiz->questions->count();
        $pointsPerQuestion = $totalQuestions > 0 ? (int) floor(100 / $totalQuestions) : 0;

        // 🎲 Deterministic question order per user & quiz (Global LMS Best Practice)
        $questions = $quiz->questions->sortBy(function ($q) use ($userId, $quizId) {
            return crc32($userId.'_'.$quizId.'_'.(string) $q->_id);
        })->values();

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
                'duration' => $durationMinutes,
                'remaining_seconds' => $remainingSeconds,
                'course_slug' => $quiz->path->course->slug ?? null,
                'path_slug' => $quiz->path->slug ?? null,
                'module_slug' => $firstModule->slug ?? null,
                'is_review' => $isReview,
                'questions' => $questions->map(function ($q) use ($userId, $userAnswersMap, $pointsPerQuestion) {
                    $qId = (string) $q->_id;
                    $submittedAnswer = $userAnswersMap[$qId] ?? null;

                    $rawUserAnswerIds = [];
                    if (is_array($submittedAnswer)) {
                        $rawUserAnswerIds = array_map('strval', $submittedAnswer);
                    } elseif ($submittedAnswer !== null && $submittedAnswer !== '') {
                        $rawUserAnswerIds = [(string) $submittedAnswer];
                    }

                    $existingAnswers = $q->answers->values();
                    $existingAnswersMap = $existingAnswers->keyBy(fn ($a) => (string) $a->_id);
                    $existingAnswerTextsMap = $existingAnswers->keyBy(fn ($a) => trim(mb_strtolower($a->answer_text)));

                    $userAnswerIds = [];
                    foreach ($rawUserAnswerIds as $rawIdx => $uId) {
                        if (isset($existingAnswersMap[$uId])) {
                            $userAnswerIds[] = $uId;
                        } else {
                            $oldAns = QuizAnswer::find($uId);
                            if ($oldAns && isset($existingAnswerTextsMap[trim(mb_strtolower($oldAns->answer_text))])) {
                                $matched = $existingAnswerTextsMap[trim(mb_strtolower($oldAns->answer_text))];
                                $userAnswerIds[] = (string) $matched->_id;
                            } elseif (isset($existingAnswers[$rawIdx])) {
                                $userAnswerIds[] = (string) $existingAnswers[$rawIdx]->_id;
                            } else {
                                $userAnswerIds[] = $uId;
                            }
                        }
                    }
                    $userAnswerIds = array_values(array_unique($userAnswerIds));

                    $correctAnswerIds = $q->answers->filter(fn ($a) => (bool) $a->is_correct)->pluck('_id')->map(fn ($id) => (string) $id)->values()->toArray();

                    $sortedUser = $userAnswerIds;
                    sort($sortedUser);
                    $sortedCorrect = $correctAnswerIds;
                    sort($sortedCorrect);
                    $isUserCorrect = (! empty($userAnswerIds) && $sortedUser === $sortedCorrect);

                    $questionScore = $isUserCorrect ? $pointsPerQuestion : 0;

                    // 🎲 Deterministic option order per user & question (Global LMS Best Practice)
                    $answers = $q->answers->sortBy(function ($a) use ($userId, $q) {
                        return crc32($userId.'_'.(string) $q->_id.'_'.(string) $a->_id);
                    })->values();

                    return [
                        'id' => $qId,
                        'question_text' => $q->question_text,
                        'explanation' => $q->explanation,
                        'media_url' => $q->media_url
                            ? (str_starts_with($q->media_url, 'http') ? $q->media_url : url('storage/'.$q->media_url))
                            : null,
                        'max_selectable' => max(1, count($correctAnswerIds)),
                        'user_answer_ids' => $userAnswerIds,
                        'is_user_correct' => $isUserCorrect,
                        'question_score' => $questionScore,
                        'max_score' => $pointsPerQuestion,
                        'correct_answer_ids' => $correctAnswerIds,
                        'answers' => $answers->map(fn ($a) => [
                            'id' => (string) $a->_id,
                            'answer_text' => $a->answer_text,
                            'is_correct' => (bool) $a->is_correct,
                        ]),
                    ];
                }),
            ],
        ]);
    }

    public function submit(SubmitQuizRequest $request, string $courseParam, string $pathParam)
    {
        try {
            $course = Course::where('slug', $courseParam)->orWhere('_id', $courseParam)->first();
            $courseId = $course ? (string) $course->_id : $courseParam;

            $path = Path::where(function ($q) use ($pathParam) {
                $q->where('slug', $pathParam)->orWhere('_id', $pathParam);
            })->where('course_id', $courseId)->firstOrFail();

            $quiz = Quiz::with(['questions.answers', 'path'])
                ->where('path_id', (string) $path->_id)
                ->firstOrFail();

            /** @var User $user */
            $user = Auth::user();

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
