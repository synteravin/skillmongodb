<?php

namespace App\Http\Controllers;

use App\Models\Quiz;
use App\Models\UserStat;
use App\Http\Requests\Quiz\SubmitQuizRequest;
use App\Actions\Quiz\SubmitQuizAction;
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
            ->every(fn($m) => in_array((string) $m->_id, $completed));

        if (!$allCompleted) {
            abort(403);
        }

        return Inertia::render('Student/Quiz/Play', [
            'quiz' => [
                'id' => (string) $quiz->_id,
                'difficulty' => $quiz->difficulty,
                'course_slug' => $quiz->path->course->slug,
                'questions' => $quiz->questions->map(fn($q) => [
                    'id' => (string) $q->_id,
                    'question_text' => $q->question_text,
                    'media_url' => $q->media_url
                        ? url('storage/' . $q->media_url)
                        : null,
                    'answers' => $q->answers->map(fn($a) => [
                        'id' => (string) $a->_id,
                        'answer_text' => $a->answer_text
                    ])
                ])
            ]
        ]);
    }

    public function submit(SubmitQuizRequest $request, $id)
    {
        $quiz = Quiz::with(['questions.answers', 'path'])
            ->findOrFail($id);

        $user = auth()->user();

        $result = app(SubmitQuizAction::class)
            ->execute($user, $quiz, $request->validated());

        if ($result->passed) {
            $progress = UserStat::firstOrCreate([
                'user_id' => $user->_id,
                'course_id' => $quiz->path->course_id
            ]);

            $completedPaths = $progress->completed_paths ?? [];

            if (!in_array((string) $quiz->path->_id, $completedPaths)) {
                $completedPaths[] = (string) $quiz->path->_id;

                $progress->update([
                    'completed_paths' => $completedPaths
                ]);
            }
        }

        return response()->json([
            'result' => [
                'score' => (int) $result->score,
                'passed' => true
            ]
        ]);
    }
}