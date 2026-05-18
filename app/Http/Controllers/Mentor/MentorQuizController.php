<?php

namespace App\Http\Controllers\Mentor;

use App\Actions\Quiz\CreateQuizAction;
use App\Actions\Quiz\DeleteQuizAction;
use App\Actions\Quiz\UpdateQuizAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Quiz\StoreQuizRequest;
use App\Models\CareerGroup;
use App\Models\Path;
use App\Models\Quiz;
use Inertia\Inertia;

class MentorQuizController extends Controller
{
    public function create(CareerGroup $group, Path $path)
    {
        $this->authorize('create', Quiz::class);

        abort_unless(
            (string) $path->career_group_id === (string) $group->_id,
            404
        );

        $path->load('quiz.questions.answers');

        return Inertia::render('Mentor/Quiz/Create', [
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

    public function store(StoreQuizRequest $request, Path $path)
    {
        $this->authorize('create', Quiz::class);

        $data = $request->validated();

        $data['path_id'] = (string) $path->_id;

        app(CreateQuizAction::class)->execute($data);

        return redirect()->back()->with('success', 'Quiz created successfully');
    }

    public function edit(Quiz $quiz)
    {
        $this->authorize('update', $quiz);

        $quiz->load('questions.answers');

        return Inertia::render('Mentor/Quiz/Edit', [
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

    public function update(StoreQuizRequest $request, Quiz $quiz)
    {
        $this->authorize('update', $quiz);

        $data = $request->validated();

        app(UpdateQuizAction::class)->execute($quiz, $data);

        return redirect()->back()->with('success', 'Quiz updated successfully');
    }

    public function destroy(Quiz $quiz)
    {
        $this->authorize('delete', $quiz);

        app(DeleteQuizAction::class)->execute($quiz);

        return redirect()->back()->with('success', 'Quiz deleted successfully');
    }
}
