<?php

namespace App\Http\Controllers\Admin;

use App\Actions\Quiz\CreateQuizAction;
use App\Actions\Quiz\DeleteQuizAction;
use App\Actions\Quiz\UpdateQuizAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Quiz\StoreQuizRequest;
use App\Models\Path;
use App\Models\Quiz;
use App\Responses\QuizResponse;
use Inertia\Inertia;

class QuizController extends Controller
{
    /* ===============================
     * INDEX
     * =============================== */
    public function index()
    {
        $this->authorize('viewAny', Quiz::class);

        $quizzes = Quiz::with(['path', 'questions'])->latest()->get();

        return Inertia::render('Admin/Quiz/Index', [
            'quizzes' => $quizzes->map(function ($quiz) {
                return [
                    'id' => (string) $quiz->_id,
                    'module_name' => $quiz->path->name ?? 'Unknown Path',
                    'path_name' => $quiz->path->name ?? 'Unknown Path',
                    'difficulty' => $quiz->difficulty ?? 'medium',
                    'questions_count' => $quiz->questions ? $quiz->questions->count() : 0,
                ];
            }),
        ]);
    }

    /* ===============================
     * CREATE PAGE
     * =============================== */
    public function create(Path $path)
    {
        $this->authorize('create', Quiz::class);

        $path->load('quiz.questions.answers');

        return Inertia::render('Admin/Quiz/Create', [
            'pathId' => (string) $path->_id,
            'quiz' => $path->quiz ? [
                'id' => (string) $path->quiz->_id,
                'difficulty' => $path->quiz->difficulty,
                'questions' => $path->quiz->questions->map(function ($q) {
                    return [
                        'question_text' => $q->question_text,
                        'media_url' => $q->media_url,
                        'answers' => $q->answers->map(function ($a) {
                            return [
                                'answer_text' => $a->answer_text,
                                'is_correct' => $a->is_correct,
                            ];
                        }),
                    ];
                }),
            ] : null,
        ]);
    }

    /* ===============================
     * STORE QUIZ (🔥 FIX UTAMA)
     * =============================== */
    public function store(StoreQuizRequest $request, Path $path)
    {
        $this->authorize('create', Quiz::class);

        $data = $request->validated();

        // 🔥 INJECT DARI ROUTE (BYPASS FRONTEND)
        $data['path_id'] = (string) $path->_id;

        app(CreateQuizAction::class)->execute($data);

        return redirect()->back()->with('success', 'Quiz created successfully');
    }

    /* ===============================
     * EDIT PAGE
     * =============================== */
    public function edit(Quiz $quiz)
    {
        $this->authorize('update', $quiz);

        $quiz->load('questions.answers');

        return Inertia::render('Admin/Quiz/Edit', [
            'quiz' => [
                'id' => (string) $quiz->_id,
                'path_id' => (string) $quiz->path_id,
                'difficulty' => $quiz->difficulty,
                'questions' => $quiz->questions->map(function ($q) {
                    return [
                        'question_text' => $q->question_text,
                        'media_url' => $q->media_url
                            ? (str_starts_with($q->media_url, 'http') ? $q->media_url : url('storage/'.$q->media_url))
                            : null,
                        'answers' => $q->answers->map(fn ($a) => [
                            'answer_text' => $a->answer_text,
                            'is_correct' => $a->is_correct,
                        ]),
                    ];
                }),
            ],
        ]);
    }

    /* ===============================
     * UPDATE QUIZ
     * =============================== */
    public function update(StoreQuizRequest $request, Quiz $quiz)
    {
        $this->authorize('update', $quiz);

        $data = $request->validated();

        app(UpdateQuizAction::class)->execute($quiz, $data);

        return redirect()->back()->with('success', 'Quiz updated successfully');
    }

    /* ===============================
     * DELETE QUIZ
     * =============================== */
    public function destroy(Quiz $quiz)
    {
        $this->authorize('delete', $quiz);

        app(DeleteQuizAction::class)->execute($quiz);

        return redirect()->back()->with('success', 'Quiz deleted successfully');
    }

    /* ===============================
     * SHOW DETAIL (API)
     * =============================== */
    public function show(Quiz $quiz)
    {
        $this->authorize('view', $quiz);

        return response()->json([
            'data' => QuizResponse::make(
                $quiz->load('questions.answers')
            ),
        ]);
    }
}
