<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Quiz;
use App\Models\Module;
use Illuminate\Http\Request;
use Inertia\Inertia;

use App\Http\Requests\Quiz\StoreQuizRequest;
use App\Actions\Quiz\CreateQuizAction;
use App\Actions\Quiz\UpdateQuizAction;
use App\Actions\Quiz\DeleteQuizAction;
use App\Responses\Quiz\QuizResponse;

class QuizController extends Controller
{
    public function index()
    {
        $this->authorize('viewAny', Quiz::class);

        $quizzes = Quiz::with(['module', 'questions'])->latest()->get();

        return Inertia::render('Admin/Quiz/Index', [
            'quizzes' => $quizzes->map(function ($quiz) {
                return [
                    'id' => (string) $quiz->_id,
                    'module_name' => $quiz->module->title ?? 'Unknown Module',
                    'difficulty' => $quiz->difficulty,
                    'questions_count' => $quiz->questions->count(),
                ];
            })
        ]);
    }
    /* ===============================
     * SHOW CREATE PAGE
     * =============================== */
    public function create(Module $module)
    {
        $this->authorize('create', Quiz::class);

        return Inertia::render('Admin/Quiz/Create', [
            'moduleId' => (string) $module->_id
        ]);
    }

    /* ===============================
     * STORE QUIZ
     * =============================== */
    public function store(StoreQuizRequest $request)
    {
        // dd($request->all(), $request->file());
        $this->authorize('create', Quiz::class);

        $quiz = app(CreateQuizAction::class)
            ->execute($request->all()); // 🔥 FIX DI SINI

        return redirect()->back()->with('success', 'Quiz created successfully');
    }

    /* ===============================
     * SHOW EDIT PAGE
     * =============================== */
    public function edit(Quiz $quiz)
    {
        $this->authorize('update', $quiz);

        $quiz->load('questions.answers');

        return Inertia::render('Admin/Quiz/Edit', [
            'quiz' => [
                'id' => (string) $quiz->_id,
                'module_id' => (string) $quiz->module_id,
                'difficulty' => $quiz->difficulty,
                'questions' => $quiz->questions->map(function ($q) {
                    return [
                        'question_text' => $q->question_text,
                        'answers' => $q->answers->map(fn($a) => [
                            'answer_text' => $a->answer_text,
                            'is_correct' => $a->is_correct,
                        ])
                    ];
                })
            ]
        ]);
    }

    /* ===============================
     * UPDATE QUIZ
     * =============================== */
    public function update(StoreQuizRequest $request, Quiz $quiz)
    {
        $this->authorize('update', $quiz);

        app(UpdateQuizAction::class)
            ->execute($quiz, $request->validated());

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
     * SHOW DETAIL (OPTIONAL API)
     * =============================== */
    public function show(Quiz $quiz)
    {
        $this->authorize('view', $quiz);

        return response()->json([
            'data' => QuizResponse::make($quiz->load('questions.answers'))
        ]);
    }
}