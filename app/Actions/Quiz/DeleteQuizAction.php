<?php

namespace App\Actions\Quiz;

use App\Models\Quiz;
use App\Models\QuizAnswer;
use App\Models\QuizQuestion;
use Illuminate\Support\Facades\Storage;

class DeleteQuizAction
{
    public function execute(Quiz $quiz)
    {
        $questions = QuizQuestion::where('quiz_id', $quiz->_id)->get();

        foreach ($questions as $q) {
            if (isset($q->media_path)) {
                Storage::disk('s3')->delete($q->media_path);
            } elseif ($q->media_url && ! str_starts_with($q->media_url, 'http')) {
                Storage::disk('public')->delete($q->media_url);
            }
        }

        $questionIds = $questions->pluck('_id');

        QuizAnswer::whereIn('question_id', $questionIds)->delete();
        QuizQuestion::where('quiz_id', $quiz->_id)->delete();

        $quiz->delete();
    }
}
