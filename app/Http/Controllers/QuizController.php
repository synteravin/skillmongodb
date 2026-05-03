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
        $quiz = Quiz::with(['path.modules', 'questions.answers'])->findOrFail($id);

        $user = auth()->user();

        $progress = UserStat::where('user_id', $user->_id)
            ->where('course_id', $quiz->path->course_id)
            ->first();

        $completed = $progress?->completed_modules ?? [];

        $allCompleted = collect($quiz->path->modules)
            ->every(fn ($m) => in_array((string) $m->_id, $completed));

        if (! $allCompleted) {
            abort(403);
        }

        $hasSubmitted = QuizResult::where('user_id', $user->_id)
            ->where('quiz_id', $quiz->_id)
            ->exists();

        return Inertia::render('Student/Quiz/Play', [
            'quiz' => [
                'id' => (string) $quiz->_id,
                'difficulty' => $quiz->difficulty,
                'course_slug' => $quiz->path->course->slug,
                'questions' => $quiz->questions->map(fn ($q) => [
                    'id' => (string) $q->_id,
                    'question_text' => $q->question_text,
                    'media_url' => $q->media_url
                        ? url('storage/'.$q->media_url)
                        : null,
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
                ->findOrFail($id);

            $user = auth()->user();

            // 🔒 CEK SUDAH PERNAH SUBMIT
            $alreadySubmitted = QuizResult::where('user_id', (string) $user->_id)
                ->where('quiz_id', (string) $quiz->_id)
                ->exists();

            if ($alreadySubmitted) {
                return response()->json([
                    'message' => 'Quiz hanya bisa dikerjakan sekali',
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
                    'passed' => true,
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
