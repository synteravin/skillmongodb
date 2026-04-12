<?php

namespace App\Http\Controllers;

use App\Models\Quiz;
use App\Models\QuizResult;
// use App\Http\Controllers\Controller;
use App\Http\Requests\Quiz\SubmitQuizRequest;
use App\Actions\Quiz\SubmitQuizAction;
use App\Responses\Quiz\QuizResponse;
use Inertia\Inertia;

class QuizController extends Controller
{
    public function show($id)
    {

        $quiz = Quiz::findOrFail($id);
        // dd([
        //     'quiz_id' => (string) $quiz->_id,
        //     'filtered_questions' => \App\Models\QuizQuestion::where('quiz_id', (string) $quiz->_id)->get()
        // ]);
        $quiz->load('questions.answers');

        return Inertia::render('Student/Quiz/Play', [
            'quiz' => [
                'id' => (string) $quiz->_id,
                'difficulty' => $quiz->difficulty,

                'questions' => $quiz->questions->map(function ($q) {
                    return [
                        'id' => (string) $q->_id,
                        'question_text' => $q->question_text,
                        'media_url' => $q->media_url
                            ? url('storage/' . $q->media_url)
                            : null,

                        'answers' => $q->answers->map(function ($a) {
                            return [
                                'id' => (string) $a->_id,
                                'answer_text' => $a->answer_text
                            ];
                        })
                    ];
                })
            ]
        ]);
    }
    // public function show(Quiz $quiz)
    // {
    //     $quiz->load('questions.answers');

    //     return Inertia::render('Student/Quiz/Play', [
    //         'quiz' => [
    //             'id' => (string) $quiz->_id,
    //             'questions' => []
    //         ]
    //     ]);
    // }

    public function submit(SubmitQuizRequest $request, $id)
    {
        $quiz = Quiz::with('questions.answers')->findOrFail($id);

        $result = app(SubmitQuizAction::class)
            ->execute(auth()->user(), $quiz, $request->validated());

        return response()->json([
            'result' => [
                'score' => (int) $result->score,
                'passed' => (bool) $result->passed,
            ],
            'message' => $result->message ?? null
        ]);
    }

    // public function result(Quiz $quiz)
    // {
    //     $result = QuizResult::where('quiz_id', $quiz->_id)
    //         ->where('user_id', auth()->id())
    //         ->latest()
    //         ->first();

    //     return Inertia::render('Student/Quiz/Result', [
    //         'result' => [
    //             'score' => $result->score,
    //             'passed' => $result->passed
    //         ]
    //     ]);
    // }
}